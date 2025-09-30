import { NextRequest, NextResponse } from 'next/server';
import { playbookService } from '@/lib/playbooks/playbook-service';
import { z } from 'zod';
import { rateLimit, RateLimits } from '@/lib/rate-limit';

// GET /api/admin/playbooks/:id/platforms - Get all platform integrations for playbook
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Apply rate limiting: 100 requests per minute
  const rateLimitResponse = await rateLimit(request, RateLimits.veryLenient);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const platforms = await playbookService.getPlatforms(params.id);
    
    return NextResponse.json({
      success: true,
      data: platforms
    });
  } catch (error) {
    console.error('Error getting platforms:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get platforms'
      },
      { status: 500 }
    );
  }
}

// POST /api/admin/playbooks/:id/platforms - Add platform integration
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Apply rate limiting: 100 requests per minute
  const rateLimitResponse = await rateLimit(request, RateLimits.veryLenient);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const body = await request.json();
    
    const platform = await playbookService.addPlatform(params.id, body);
    
    return NextResponse.json({
      success: true,
      data: platform,
      message: 'Platform integration added successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error adding platform:', error);
    
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
        error: error instanceof Error ? error.message : 'Failed to add platform integration'
      },
      { status: 500 }
    );
  }
}