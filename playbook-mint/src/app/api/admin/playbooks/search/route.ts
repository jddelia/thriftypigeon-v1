import { NextRequest, NextResponse } from 'next/server';
import { playbookService } from '@/lib/playbooks/playbook-service';
import { rateLimit, RateLimits } from '@/lib/rate-limit';

// GET /api/admin/playbooks/search - Search playbooks
export async function GET(request: NextRequest) {
  // Apply rate limiting: 100 requests per minute
  const rateLimitResponse = await rateLimit(request, RateLimits.veryLenient);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const { searchParams } = new URL(request.url);
    
    const query = searchParams.get('q');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10;
    
    if (!query) {
      return NextResponse.json(
        {
          success: false,
          error: 'Search query is required'
        },
        { status: 400 }
      );
    }
    
    const results = await playbookService.searchPlaybooks(query, limit);
    
    return NextResponse.json({
      success: true,
      data: results,
      query,
      limit
    });
  } catch (error) {
    console.error('Error searching playbooks:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to search playbooks'
      },
      { status: 500 }
    );
  }
}