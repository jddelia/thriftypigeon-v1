/**
 * Email Integration Examples
 * 
 * This file contains examples of how to integrate the email system
 * with other parts of The Thrifty Pigeon application.
 */

import { sendWelcomeEmail, isValidEmail, extractFirstName } from './email-service';

// Example: Newsletter signup integration
export async function handleNewsletterSignup(
  email: string, 
  name?: string,
  source: string = 'website'
) {
  // Validate email
  if (!isValidEmail(email)) {
    return { success: false, error: 'Invalid email address' };
  }

  try {
    // Extract first name for personalization
    const firstName = name ? extractFirstName(name) : extractFirstName(email);

    // Send welcome email
    const result = await sendWelcomeEmail({ 
      email, 
      firstName 
    });

    if (result.success) {
      console.log(`Welcome email sent to ${email} (source: ${source})`);
      
      // Here you would typically also:
      // 1. Add to newsletter database
      // 2. Track in analytics (PostHog)
      // 3. Update user preferences
      
      return { 
        success: true, 
        message: 'Welcome email sent successfully',
        emailId: result.id 
      };
    } else {
      console.error(`Failed to send welcome email to ${email}:`, result.error);
      return { 
        success: false, 
        error: 'Failed to send welcome email' 
      };
    }

  } catch (error) {
    console.error('Newsletter signup error:', error);
    return { 
      success: false, 
      error: 'Internal error during newsletter signup' 
    };
  }
}

// Example: Contact form integration
export async function handleContactForm(
  name: string,
  email: string,
  message: string
) {
  // This would typically:
  // 1. Send confirmation to user
  // 2. Send notification to admin
  // 3. Store in support system

  console.log('Contact form submission:', { name, email, message });
  
  // For now, just log the contact
  return { 
    success: true, 
    message: 'Contact form received. You\'ll hear back within 24 hours.' 
  };
}

// Example: Purchase completion integration (for future Lemon Squeezy integration)
export async function handlePurchaseComplete(
  customerEmail: string,
  customerName: string,
  orderId: string,
  productName: string,
  downloadUrl: string
) {
  // This would:
  // 1. Send purchase confirmation email
  // 2. Send download fulfillment email
  // 3. Add customer to email list
  // 4. Track purchase in analytics

  console.log('Purchase completed:', { 
    customerEmail, 
    customerName, 
    orderId, 
    productName 
  });
  
  // If customer is new, send welcome email
  const firstName = extractFirstName(customerName);
  
  // This could also trigger a purchase-specific email sequence
  return { 
    success: true, 
    message: 'Purchase processed and emails sent' 
  };
}

// Example: API endpoint usage from client-side
export const emailAPIExamples = {
  // Send welcome email via API
  sendWelcome: async (email: string, firstName?: string) => {
    const response = await fetch('/api/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'welcome',
        to: email,
        data: { firstName, email }
      })
    });
    
    return response.json();
  },

  // Send test email (development only)
  sendTest: async (email: string) => {
    const response = await fetch('/api/email/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        firstName: 'Test User'
      })
    });
    
    return response.json();
  },

  // Preview email template in browser
  previewTemplate: (template: string, email?: string, firstName?: string) => {
    const params = new URLSearchParams({
      template,
      ...(email && { email }),
      ...(firstName && { firstName })
    });
    
    return `/api/email/send?${params.toString()}`;
  }
};

// Utility: Check if emails are working in current environment
export async function checkEmailHealth(): Promise<{
  healthy: boolean;
  message: string;
  details?: any;
}> {
  try {
    const response = await fetch('/api/email/test', {
      method: 'GET',
    });
    
    const data = await response.json();
    
    if (data.status?.configured) {
      return {
        healthy: true,
        message: 'Email system is properly configured'
      };
    } else {
      return {
        healthy: false,
        message: 'Email system configuration issues',
        details: data.status?.errors
      };
    }
    
  } catch (error) {
    return {
      healthy: false,
      message: 'Failed to check email system health',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}