import { NextRequest, NextResponse } from 'next/server';
import { playbookService } from '@/lib/playbooks/playbook-service';
import { rateLimit, RateLimits } from '@/lib/rate-limit';

// GET /api/playbooks/:slug - Get playbook by slug (public endpoint)
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  // Apply rate limiting: 60 requests per minute
  const rateLimitResponse = await rateLimit(request, RateLimits.lenient);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const playbook = await playbookService.getPlaybookBySlug(params.slug);
    
    if (!playbook || playbook.status !== 'published') {
      return NextResponse.json(
        {
          success: false,
          error: 'Playbook not found'
        },
        { status: 404 }
      );
    }
    
    // Get platform integrations for checkout options
    const platforms = await playbookService.getPlatforms(playbook.id);
    const activePlatforms = platforms.filter(p => p.isActive);
    
    // Format public playbook data
    const publicPlaybook = {
      id: playbook.id,
      sku: playbook.sku,
      slug: playbook.slug,
      title: playbook.title,
      headline: playbook.headline,
      shortDescription: playbook.shortDescription,
      longDescription: playbook.longDescription,
      featureBullets: playbook.featureBullets,
      coverImageUrl: playbook.coverImageUrl,
      coverImageAlt: playbook.coverImageAlt,
      galleryImages: playbook.galleryImages,
      demoVideoUrl: playbook.demoVideoUrl,
      basePriceCents: playbook.basePriceCents,
      currency: playbook.currency,
      category: playbook.category,
      tags: playbook.tags,
      difficultyLevel: playbook.difficultyLevel,
      metaTitle: playbook.metaTitle,
      metaDescription: playbook.metaDescription,
      isFeatured: playbook.isFeatured,
      totalViews: playbook.totalViews,
      totalPurchases: playbook.totalPurchases,
      publishedAt: playbook.publishedAt,
      version: playbook.version,
      
      // Platform checkout options
      checkoutOptions: activePlatforms.map(platform => ({
        platform: platform.platform,
        price: platform.priceCents,
        currency: platform.currency,
        checkoutUrl: platform.checkoutUrl,
      }))
    };
    
    // Track the view event
    try {
      await playbookService.trackEvent({
        playbookId: playbook.id,
        eventType: 'view',
        platform: 'website',
        referrerUrl: request.headers.get('referer') || undefined,
      });
    } catch (trackingError) {
      // Don't fail the request if tracking fails
      console.warn('Failed to track view event:', trackingError);
    }
    
    return NextResponse.json({
      success: true,
      data: publicPlaybook
    });
  } catch (error) {
    console.error('Error getting public playbook:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to load playbook'
      },
      { status: 500 }
    );
  }
}