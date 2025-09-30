// Email system type definitions

export interface EmailTemplate {
  subject: string;
  component: React.ComponentType<any>;
}

export interface EmailEvent {
  type: 'newsletter_signup' | 'purchase_complete' | 'contact_form' | 'download_request';
  email: string;
  data?: Record<string, any>;
  timestamp: Date;
}

export interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  template: string;
  recipients: string[];
  scheduledAt?: Date;
  sentAt?: Date;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
}

export interface EmailMetrics {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  complained: number;
  unsubscribed: number;
}

export interface NewsletterSubscriber {
  email: string;
  firstName?: string;
  lastName?: string;
  subscribedAt: Date;
  status: 'active' | 'unsubscribed' | 'bounced' | 'complained';
  tags: string[];
  source: 'website' | 'popup' | 'purchase' | 'manual';
}

export interface EmailSequence {
  id: string;
  name: string;
  trigger: EmailEvent['type'];
  emails: {
    delay: number; // hours after trigger
    template: string;
    subject: string;
  }[];
}

export interface PurchaseEmailData {
  customerEmail: string;
  customerName?: string;
  orderId: string;
  productName: string;
  productSku: string;
  amount: number;
  downloadUrl?: string;
  receiptUrl?: string;
}

export interface ContactEmailData {
  name: string;
  email: string;
  message: string;
  subject?: string;
  source: 'contact_form' | 'support' | 'feedback';
}