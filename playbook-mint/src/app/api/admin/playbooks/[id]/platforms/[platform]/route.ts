import { NextRequest, NextResponse } from 'next/server';
import { playbookService } from '@/lib/playbooks/playbook-service';
import { z } from 'zod';
import { rateLimit, RateLimits } from '@/lib/rate-limit';

// PUT /api/admin/playbooks/:id/platforms/:platform - Update platform integration
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; platform: string } }
) {
  // Apply rate limiting: 100 requests per minute
  const rateLimitResponse = await rateLimit(request, RateLimits.veryLenient);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const body = await request.json();
    
    const platform = await playbookService.updatePlatform(
      params.id, 
      params.platform, 
      body
    );
    
    return NextResponse.json({
      success: true,
      data: platform,
      message: 'Platform integration updated successfully'
    });
  } catch (error) {
    console.error('Error updating platform:', error);
    
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
    
    // Handle not found
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json(
        {
          success: false,
          error: error.message
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update platform integration'
      },
      { status: 500 }
    );
  }
}