import { NextRequest, NextResponse } from 'next/server';
import { playbookService } from '@/lib/playbooks/playbook-service';

// POST /api/admin/playbooks/:id/publish - Publish playbook
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const playbook = await playbookService.publishPlaybook(params.id);
    
    return NextResponse.json({
      success: true,
      data: playbook,
      message: 'Playbook published successfully'
    });
  } catch (error) {
    console.error('Error publishing playbook:', error);
    
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
        error: error instanceof Error ? error.message : 'Failed to publish playbook'
      },
      { status: 500 }
    );
  }
}