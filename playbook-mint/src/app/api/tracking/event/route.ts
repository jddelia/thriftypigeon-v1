import { NextRequest, NextResponse } from 'next/server';
import { playbookService } from '@/lib/playbooks/playbook-service';
import { z } from 'zod';
import { rateLimit, RateLimits } from '@/lib/rate-limit';

const trackEventSchema = z.object({
  playbookId: z.string(),
  eventType: z.enum(['view', 'add_to_cart', 'purchase', 'refund']),
  platform: z.enum(['stripe', 'lemonsqueezy', 'gumroad', 'website']).optional(),
  userId: z.string().optional(),
  sessionId: z.string().optional(),
  visitorId: z.string().optional(),
  referrerUrl: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  articleSlug: z.string().optional(),
  deviceType: z.enum(['mobile', 'desktop', 'tablet']).optional(),
  countryCode: z.string().optional(),
  revenueCents: z.number().optional(),
  metadata: z.record(z.any()).optional(),
});

// POST /api/tracking/event - Track user events (public endpoint)
export async function POST(request: NextRequest) {
  // Apply rate limiting: 100 requests per minute
  const rateLimitResponse = await rateLimit(request, RateLimits.veryLenient);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const body = await request.json();
    const validatedData = trackEventSchema.parse(body);
    
    // Extract additional context from request headers
    const userAgent = request.headers.get('user-agent');
    const xForwardedFor = request.headers.get('x-forwarded-for');
    const xRealIp = request.headers.get('x-real-ip');
    
    // Get IP address (prioritize x-real-ip over x-forwarded-for)
    const ipAddress = xRealIp || (xForwardedFor?.split(',')[0]) || 'unknown';
    
    // Auto-detect device type from user agent if not provided
    let deviceType = validatedData.deviceType;
    if (!deviceType && userAgent) {
      if (/mobile/i.test(userAgent)) {
        deviceType = 'mobile';
      } else if (/tablet/i.test(userAgent)) {
        deviceType = 'tablet';
      } else {
        deviceType = 'desktop';
      }
    }
    
    await playbookService.trackEvent({
      ...validatedData,
      deviceType,
      metadata: {
        ...validatedData.metadata,
        userAgent: userAgent || undefined,
        ipAddress,
        timestamp: new Date().toISOString(),
      }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Event tracked successfully'
    });
  } catch (error) {
    console.error('Error tracking event:', error);
    
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to track event'
      },
      { status: 500 }
    );
  }
}