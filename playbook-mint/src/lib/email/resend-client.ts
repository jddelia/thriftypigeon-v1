import { Resend } from 'resend';
import { render } from '@react-email/render';
import React, { ComponentType } from 'react';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY environment variable is required');
}

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailOptions {
  to: string | string[];
  subject: string;
  template: ComponentType<any>;
  props?: any;
  from?: string;
  replyTo?: string;
  tags?: { name: string; value: string }[];
}

export interface EmailResult {
  success: boolean;
  id?: string;
  error?: string;
}

export async function sendEmail({
  to,
  subject,
  template: Template,
  props = {},
  from = `${process.env.FROM_NAME || 'The Thrifty Pigeon'} <${process.env.FROM_EMAIL || 'hello@thethriftypigeon.com'}>`,
  replyTo = process.env.SUPPORT_EMAIL || 'hello@thethriftypigeon.com',
  tags = []
}: EmailOptions): Promise<EmailResult> {
  try {
    // Render the React component to HTML
    const html = await render(React.createElement(Template, props));
    
    // Also render a plain text version
    const text = await render(React.createElement(Template, props), { 
      plainText: true 
    });

    const { data, error } = await resend.emails.send({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text,
      replyTo,
      tags: tags.length > 0 ? tags : undefined,
    });

    if (error) {
      console.error('Resend email error:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to send email' 
      };
    }

    console.log('Email sent successfully:', data?.id);
    return { 
      success: true, 
      id: data?.id 
    };

  } catch (error) {
    console.error('Email sending failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}

// Utility function for sending emails with error handling and logging
export async function sendEmailSafely(options: EmailOptions): Promise<EmailResult> {
  try {
    const result = await sendEmail(options);
    
    // Log the attempt for debugging
    console.log(`Email attempt to ${options.to}:`, {
      subject: options.subject,
      success: result.success,
      id: result.id,
      error: result.error
    });
    
    return result;
  } catch (error) {
    console.error('Unexpected error in sendEmailSafely:', error);
    return {
      success: false,
      error: 'Unexpected error occurred while sending email'
    };
  }
}

// Export the raw Resend client for advanced usage
export { resend };