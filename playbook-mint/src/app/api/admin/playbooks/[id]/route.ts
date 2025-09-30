import { NextRequest, NextResponse } from 'next/server';
import { playbookService } from '@/lib/playbooks/playbook-service';
import { z } from 'zod';
import { rateLimit, RateLimits } from '@/lib/rate-limit';

// GET /api/admin/playbooks/:id - Get playbook details
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
    const playbook = await playbookService.getPlaybookById(params.id);
    
    if (!playbook) {
      return NextResponse.json(
        {
          success: false,
          error: 'Playbook not found'
        },
        { status: 404 }
      );
    }
    
    // Also get platform integrations
    const platforms = await playbookService.getPlatforms(params.id);
    
    return NextResponse.json({
      success: true,
      data: {
        ...playbook,
        platforms
      }
    });
  } catch (error) {
    console.error('Error getting playbook:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get playbook'
      },
      { status: 500 }
    );
  }
}

// PUT /api/admin/playbooks/:id - Update playbook
export async function PUT(
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
    
    const playbook = await playbookService.updatePlaybook(params.id, body);
    
    return NextResponse.json({
      success: true,
      data: playbook,
      message: 'Playbook updated successfully'
    });
  } catch (error) {
    console.error('Error updating playbook:', error);
    
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
        error: error instanceof Error ? error.message : 'Failed to update playbook'
      },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/playbooks/:id - Soft delete playbook
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Apply rate limiting: 100 requests per minute
  const rateLimitResponse = await rateLimit(request, RateLimits.veryLenient);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    await playbookService.deletePlaybook(params.id);
    
    return NextResponse.json({
      success: true,
      message: 'Playbook deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting playbook:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete playbook'
      },
      { status: 500 }
    );
  }
}