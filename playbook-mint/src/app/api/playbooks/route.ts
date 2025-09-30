import { NextRequest, NextResponse } from 'next/server';
import { playbookService } from '@/lib/playbooks/playbook-service';

// GET /api/playbooks - List published playbooks (public endpoint)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const options = {
      status: 'published' as const, // Only show published playbooks
      category: searchParams.get('category') || undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0,
      orderBy: searchParams.get('orderBy') as 'created_at' | 'updated_at' | 'total_views' | 'total_purchases' | 'total_revenue_cents' | undefined,
      orderDirection: searchParams.get('orderDirection') as 'asc' | 'desc' | undefined,
    };

    const playbooks = await playbookService.listPlaybooks(options);
    
    // Filter out sensitive admin data for public API
    const publicPlaybooks = playbooks.map(playbook => ({
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
      // Exclude sensitive data like revenue, analytics details, etc.
    }));
    
    return NextResponse.json({
      success: true,
      data: publicPlaybooks,
      pagination: {
        limit: options.limit,
        offset: options.offset,
        total: publicPlaybooks.length
      }
    });
  } catch (error) {
    console.error('Error listing public playbooks:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to load playbooks'
      },
      { status: 500 }
    );
  }
}