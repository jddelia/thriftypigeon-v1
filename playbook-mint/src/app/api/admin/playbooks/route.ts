import { NextRequest, NextResponse } from 'next/server';
import { playbookService } from '@/lib/playbooks/playbook-service';
import { z } from 'zod';

// GET /api/admin/playbooks - List all playbooks with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const options = {
      status: searchParams.get('status') as 'draft' | 'published' | 'archived' | undefined,
      category: searchParams.get('category') || undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0,
      orderBy: searchParams.get('orderBy') as 'created_at' | 'updated_at' | 'total_views' | 'total_purchases' | 'total_revenue_cents' | undefined,
      orderDirection: searchParams.get('orderDirection') as 'asc' | 'desc' | undefined,
    };

    const playbooks = await playbookService.listPlaybooks(options);
    
    return NextResponse.json({
      success: true,
      data: playbooks,
      pagination: {
        limit: options.limit,
        offset: options.offset,
        total: playbooks.length
      }
    });
  } catch (error) {
    console.error('Error listing playbooks:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to list playbooks'
      },
      { status: 500 }
    );
  }
}

// POST /api/admin/playbooks - Create new playbook
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const playbook = await playbookService.createPlaybook(body);
    
    return NextResponse.json({
      success: true,
      data: playbook,
      message: 'Playbook created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating playbook:', error);
    
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
        error: error instanceof Error ? error.message : 'Failed to create playbook'
      },
      { status: 500 }
    );
  }
}