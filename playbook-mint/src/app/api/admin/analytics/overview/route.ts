import { NextRequest, NextResponse } from 'next/server';
import { playbookService } from '@/lib/playbooks/playbook-service';

// GET /api/admin/analytics/overview - Dashboard overview
export async function GET(request: NextRequest) {
  try {
    const overview = await playbookService.getDashboardOverview();
    
    return NextResponse.json({
      success: true,
      data: overview
    });
  } catch (error) {
    console.error('Error getting dashboard overview:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get dashboard overview'
      },
      { status: 500 }
    );
  }
}