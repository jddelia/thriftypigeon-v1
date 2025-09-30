import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import React from 'react';
import { render } from '@react-email/render';
import { sendEmailSafely } from '@/lib/email/resend-client';
import { WelcomeEmail } from '@/emails/templates/welcome';
import { rateLimit, RateLimits } from '@/lib/rate-limit';

// Email request validation schema
const emailRequestSchema = z.object({
  type: z.enum(['welcome', 'purchase', 'newsletter', 'support', 'test']),
  to: z.string().email('Invalid email address'),
  data: z.object({}).passthrough().optional(),
});

// Individual email type schemas
const welcomeEmailSchema = z.object({
  firstName: z.string().optional(),
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  // Apply rate limiting: 3 requests per hour
  const rateLimitResponse = await rateLimit(request, RateLimits.veryStrict);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    // Parse and validate the request body
    const body = await request.json();
    const { type, to, data = {} } = emailRequestSchema.parse(body);

    let result;
    
    switch (type) {
      case 'welcome': {
        // Validate welcome email specific data
        const welcomeData = welcomeEmailSchema.parse({ ...data, email: to });
        
        result = await sendEmailSafely({
          to,
          subject: 'Welcome to The Thrifty Pigeon! Here\'s what you need 👋',
          template: WelcomeEmail,
          props: welcomeData,
          tags: [
            { name: 'category', value: 'onboarding' },
            { name: 'template', value: 'welcome' }
          ]
        });
        break;
      }

      case 'test': {
        // Test email for development
        result = await sendEmailSafely({
          to,
          subject: 'Test Email from The Thrifty Pigeon',
          template: WelcomeEmail,
          props: { firstName: 'Test User', email: to },
          tags: [
            { name: 'category', value: 'test' },
            { name: 'template', value: 'welcome' }
          ]
        });
        break;
      }

      default:
        return NextResponse.json(
          { error: `Email type "${type}" not yet implemented` },
          { status: 400 }
        );
    }

    // Return the result
    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        id: result.id,
        message: 'Email sent successfully'
      });
    } else {
      return NextResponse.json(
        { 
          error: 'Failed to send email', 
          details: result.error 
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Email API error:', error);
    
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid request data', 
          details: error.errors 
        },
        { status: 400 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET endpoint for testing email templates in development
export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Template preview only available in development' },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(request.url);
  const template = searchParams.get('template');
  const email = searchParams.get('email') || 'test@example.com';
  const firstName = searchParams.get('firstName') || 'Test User';

  if (template === 'welcome') {
    try {
      const html = await render(
        React.createElement(WelcomeEmail, { firstName, email })
      );
      
      return new Response(html, {
        headers: { 'Content-Type': 'text/html' },
      });
    } catch (error) {
      console.error('Email template rendering error:', error);
      return NextResponse.json(
        { 
          error: 'Failed to render template',
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
      );
    }
  }

  return NextResponse.json(
    { 
      message: 'Email template preview',
      available_templates: ['welcome'],
      usage: '?template=welcome&email=test@example.com&firstName=Test'
    }
  );
}