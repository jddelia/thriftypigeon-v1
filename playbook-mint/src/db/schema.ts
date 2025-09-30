import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// Newsletter Subscribers - Core table for newsletter functionality
export const newsletterSubscribers = sqliteTable('newsletter_subscribers', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text('email').unique().notNull(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  status: text('status', { 
    enum: ['pending', 'active', 'unsubscribed', 'bounced', 'complained'] 
  }).notNull().default('pending'),
  source: text('source', {
    enum: ['website', 'popup', 'purchase', 'manual', 'import']
  }).notNull().default('website'),
  signupIp: text('signup_ip'),
  signupUserAgent: text('signup_user_agent'),
  doubleOptInToken: text('double_opt_in_token'),
  doubleOptInConfirmedAt: integer('double_opt_in_confirmed_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
  unsubscribedAt: integer('unsubscribed_at', { mode: 'timestamp' }),
  unsubscribeReason: text('unsubscribe_reason'),
  
  // GDPR/Privacy
  gdprConsent: integer('gdpr_consent', { mode: 'boolean' }).default(false),
  gdprConsentDate: integer('gdpr_consent_date', { mode: 'timestamp' }),
  
  // Email Preferences - JSON column
  emailPreferences: text('email_preferences', { mode: 'json' }).$type<{
    newsletter: boolean;
    marketing: boolean;
    productUpdates: boolean;
  }>().default(JSON.stringify({
    newsletter: true,
    marketing: false,
    productUpdates: true
  })),
  
  // Analytics
  totalEmailsSent: integer('total_emails_sent').default(0),
  totalEmailsOpened: integer('total_emails_opened').default(0),
  totalEmailsClicked: integer('total_emails_clicked').default(0),
  lastEmailSentAt: integer('last_email_sent_at', { mode: 'timestamp' }),
  lastEmailOpenedAt: integer('last_email_opened_at', { mode: 'timestamp' }),
  
  // Segmentation
  tags: text('tags', { mode: 'json' }).$type<string[]>().default(JSON.stringify([])),
  segment: text('segment', { enum: ['beginner', 'intermediate', 'advanced'] }),
  lifetimeValueCents: integer('lifetime_value_cents').default(0),
});

// Email Campaign Tracking
export const emailCampaigns = sqliteTable('email_campaigns', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  subject: text('subject').notNull(),
  templateName: text('template_name').notNull(), // welcome, newsletter, purchase, etc.
  recipientCount: integer('recipient_count').default(0),
  status: text('status', {
    enum: ['draft', 'scheduled', 'sending', 'sent', 'failed']
  }).notNull().default('draft'),
  scheduledAt: integer('scheduled_at', { mode: 'timestamp' }),
  startedAt: integer('started_at', { mode: 'timestamp' }),
  completedAt: integer('completed_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  
  // Content
  emailContentHtml: text('email_content_html'),
  emailContentText: text('email_content_text'),
  
  // Analytics
  totalSent: integer('total_sent').default(0),
  totalDelivered: integer('total_delivered').default(0),
  totalOpened: integer('total_opened').default(0),
  totalClicked: integer('total_clicked').default(0),
  totalBounced: integer('total_bounced').default(0),
  totalComplained: integer('total_complained').default(0),
  totalUnsubscribed: integer('total_unsubscribed').default(0),
  
  // Metadata
  createdBy: text('created_by').default('system'),
  notes: text('notes'),
});

// Individual Email Delivery Tracking
export const emailDeliveries = sqliteTable('email_deliveries', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  campaignId: text('campaign_id').references(() => emailCampaigns.id),
  subscriberId: text('subscriber_id').references(() => newsletterSubscribers.id),
  resendEmailId: text('resend_email_id'), // ID from Resend API
  status: text('status', {
    enum: ['pending', 'sent', 'delivered', 'bounced', 'complained']
  }).notNull().default('pending'),
  sentAt: integer('sent_at', { mode: 'timestamp' }),
  deliveredAt: integer('delivered_at', { mode: 'timestamp' }),
  firstOpenedAt: integer('first_opened_at', { mode: 'timestamp' }),
  lastOpenedAt: integer('last_opened_at', { mode: 'timestamp' }),
  totalOpens: integer('total_opens').default(0),
  totalClicks: integer('total_clicks').default(0),
  bounceReason: text('bounce_reason'),
  complaintReason: text('complaint_reason'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  
  // Tracking data
  trackingData: text('tracking_data', { mode: 'json' }).$type<{
    clickedLinks?: string[];
    userAgent?: string;
    ipAddress?: string;
  }>().default(JSON.stringify({})),
});

// Email Templates (for future newsletter builder)
export const emailTemplates = sqliteTable('email_templates', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').unique().notNull(),
  subjectTemplate: text('subject_template').notNull(),
  htmlTemplate: text('html_template').notNull(),
  textTemplate: text('text_template'),
  templateVariables: text('template_variables', { mode: 'json' }).$type<string[]>()
    .default(JSON.stringify(['firstName', 'unsubscribeUrl'])),
  category: text('category', {
    enum: ['welcome', 'newsletter', 'transactional', 'marketing']
  }).notNull().default('newsletter'),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
  
  // A/B Testing
  abTestVariants: text('a_b_test_variants', { mode: 'json' }).$type<{
    subjectLines?: string[];
    variants?: { name: string; weight: number }[];
  }>().default(JSON.stringify({})),
  
  // Analytics
  totalSent: integer('total_sent').default(0),
  avgOpenRate: real('avg_open_rate').default(0.0),
  avgClickRate: real('avg_click_rate').default(0.0),
});

// Website Analytics Integration
export const signupSources = sqliteTable('signup_sources', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  sourceName: text('source_name').notNull(), // homepage_hero, footer_newsletter, popup, article_cta
  pageUrl: text('page_url'),
  referrer: text('referrer'),
  utmSource: text('utm_source'),
  utmMedium: text('utm_medium'),
  utmCampaign: text('utm_campaign'),
  signupCount: integer('signup_count').default(0),
  conversionRate: real('conversion_rate').default(0.0),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// Newsletter Content Management (for future newsletter builder)
export const newsletterIssues = sqliteTable('newsletter_issues', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  issueNumber: integer('issue_number').unique(),
  title: text('title').notNull(),
  subjectLine: text('subject_line').notNull(),
  featuredArticleUrl: text('featured_article_url'),
  featuredArticleTitle: text('featured_article_title'),
  additionalContent: text('additional_content', { mode: 'json' }).$type<{
    articles?: { title: string; url: string; description?: string }[];
    tips?: string[];
    announcements?: string[];
  }>().default(JSON.stringify({})),
  status: text('status', { enum: ['draft', 'scheduled', 'sent'] }).default('draft'),
  scheduledSendDate: integer('scheduled_send_date', { mode: 'timestamp' }),
  actualSendDate: integer('actual_send_date', { mode: 'timestamp' }),
  recipientCount: integer('recipient_count').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});

// Type exports for use throughout the application
export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type NewNewsletterSubscriber = typeof newsletterSubscribers.$inferInsert;

export type EmailCampaign = typeof emailCampaigns.$inferSelect;
export type NewEmailCampaign = typeof emailCampaigns.$inferInsert;

export type EmailDelivery = typeof emailDeliveries.$inferSelect;
export type NewEmailDelivery = typeof emailDeliveries.$inferInsert;

export type EmailTemplate = typeof emailTemplates.$inferSelect;
export type NewEmailTemplate = typeof emailTemplates.$inferInsert;

export type SignupSource = typeof signupSources.$inferSelect;
export type NewSignupSource = typeof signupSources.$inferInsert;

export type NewsletterIssue = typeof newsletterIssues.$inferSelect;
export type NewNewsletterIssue = typeof newsletterIssues.$inferInsert;