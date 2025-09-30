import { sendEmailSafely, EmailResult } from './resend-client';
import { WelcomeEmail } from '@/emails/templates/welcome';

// Centralized email service functions for easy use across the app

export interface WelcomeEmailData {
  email: string;
  firstName?: string;
}

/**
 * Send a welcome email to a new subscriber
 */
export async function sendWelcomeEmail({ 
  email, 
  firstName = 'there' 
}: WelcomeEmailData): Promise<EmailResult> {
  return sendEmailSafely({
    to: email,
    subject: 'Welcome to The Thrifty Pigeon! Here\'s what you need 👋',
    template: WelcomeEmail,
    props: { email, firstName },
    tags: [
      { name: 'category', value: 'onboarding' },
      { name: 'template', value: 'welcome' }
    ]
  });
}

/**
 * Send a test email (for development/testing)
 */
export async function sendTestEmail(
  email: string, 
  firstName: string = 'Test User'
): Promise<EmailResult> {
  return sendEmailSafely({
    to: email,
    subject: 'Test Email from The Thrifty Pigeon 🧪',
    template: WelcomeEmail,
    props: { email, firstName },
    tags: [
      { name: 'category', value: 'test' },
      { name: 'template', value: 'welcome' }
    ]
  });
}

// Email validation utility
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Extract first name from full name or email
export function extractFirstName(nameOrEmail: string): string {
  // If it looks like an email, extract the part before @
  if (nameOrEmail.includes('@')) {
    const localPart = nameOrEmail.split('@')[0];
    // Remove common separators and take the first part
    return localPart.split(/[._-]/)[0];
  }
  
  // If it's a name, take the first word
  const firstWord = nameOrEmail.trim().split(' ')[0];
  
  // Capitalize first letter
  return firstWord.charAt(0).toUpperCase() + firstWord.slice(1).toLowerCase();
}

// Email service status
export interface EmailServiceStatus {
  configured: boolean;
  apiKey: boolean;
  fromEmail: boolean;
  errors: string[];
}

/**
 * Check if email service is properly configured
 */
export function checkEmailServiceStatus(): EmailServiceStatus {
  const errors: string[] = [];
  
  const apiKey = !!process.env.RESEND_API_KEY;
  if (!apiKey) {
    errors.push('RESEND_API_KEY is not set');
  }
  
  const fromEmail = !!process.env.FROM_EMAIL;
  if (!fromEmail) {
    errors.push('FROM_EMAIL is not set');
  }
  
  return {
    configured: errors.length === 0,
    apiKey,
    fromEmail,
    errors
  };
}