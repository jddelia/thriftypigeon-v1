import { NextRequest, NextResponse } from 'next/server';
import { sendTestEmail, checkEmailServiceStatus } from '@/lib/email/email-service';
import { z } from 'zod';

const testEmailSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().optional().default('Test User'),
});

export async function POST(request: NextRequest) {
  // Only allow in development or with proper auth
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Test emails not available in production' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { email, firstName } = testEmailSchema.parse(body);

    // Check if email service is configured
    const status = checkEmailServiceStatus();
    if (!status.configured) {
      return NextResponse.json(
        { 
          error: 'Email service not properly configured',
          details: status.errors
        },
        { status: 500 }
      );
    }

    // Send test email
    const result = await sendTestEmail(email, firstName);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Test email sent successfully to ${email}`,
        id: result.id
      });
    } else {
      return NextResponse.json(
        { 
          error: 'Failed to send test email', 
          details: result.error 
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Test email error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid request data', 
          details: error.errors 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const status = checkEmailServiceStatus();
  
  return NextResponse.json({
    message: 'Email service status',
    status,
    environment: process.env.NODE_ENV,
    testingAvailable: process.env.NODE_ENV !== 'production',
    usage: {
      post: 'POST /api/email/test with { "email": "test@example.com", "firstName": "Test User" }',
      preview: 'GET /api/email/send?template=welcome&email=test@example.com&firstName=Test'
    }
  });
}