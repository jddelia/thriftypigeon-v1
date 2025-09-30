import { NextRequest, NextResponse } from 'next/server';
import { playbookService } from '@/lib/playbooks/playbook-service';

// GET /api/admin/analytics/playbooks/:id - Individual playbook analytics
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    
    const options: {
      dateFrom?: Date;
      dateTo?: Date;
    } = {};
    
    // Parse date filters
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    
    if (dateFrom) {
      options.dateFrom = new Date(dateFrom);
    }
    
    if (dateTo) {
      options.dateTo = new Date(dateTo);
    }
    
    const analytics = await playbookService.getPlaybookAnalytics(params.id, options);
    
    return NextResponse.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Error getting playbook analytics:', error);
    
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
        error: error instanceof Error ? error.message : 'Failed to get playbook analytics'
      },
      { status: 500 }
    );
  }
}