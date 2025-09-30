import { sqliteTable, text, integer, real, unique } from 'drizzle-orm/sqlite-core';
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

// ==========================================
// PLAYBOOK MANAGEMENT SYSTEM
// ==========================================

// Main playbooks catalog with comprehensive metadata
export const playbooks = sqliteTable('playbooks', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  sku: text('sku').unique().notNull(),
  slug: text('slug').unique().notNull(), // URL friendly
  
  // Core Content
  title: text('title').notNull(),
  headline: text('headline').notNull(),
  shortDescription: text('short_description').notNull(),
  longDescription: text('long_description'),
  featureBullets: text('feature_bullets', { mode: 'json' }).$type<string[]>().default(JSON.stringify([])),
  
  // Media Assets
  coverImageUrl: text('cover_image_url'),
  coverImageAlt: text('cover_image_alt'),
  galleryImages: text('gallery_images', { mode: 'json' }).$type<string[]>().default(JSON.stringify([])),
  demoVideoUrl: text('demo_video_url'),
  
  // Pricing Strategy
  basePriceCents: integer('base_price_cents').notNull(),
  currency: text('currency').default('USD'),
  pricingStrategy: text('pricing_strategy', { enum: ['fixed', 'tiered', 'dynamic'] }).default('fixed'),
  
  // Platform Integration
  stripeProductId: text('stripe_product_id'),
  stripePriceId: text('stripe_price_id'),
  lemonsqueezyProductId: text('lemonsqueezy_product_id'),
  lemonsqueezyVariantId: text('lemonsqueezy_variant_id'),
  gumroadProductId: text('gumroad_product_id'),
  
  // Content Management
  status: text('status', { enum: ['draft', 'published', 'archived', 'discontinued'] }).default('draft'),
  category: text('category'),
  tags: text('tags', { mode: 'json' }).$type<string[]>().default(JSON.stringify([])),
  difficultyLevel: text('difficulty_level', { enum: ['beginner', 'intermediate', 'advanced'] }).default('beginner'),
  
  // SEO & Marketing
  metaTitle: text('meta_title'),
  metaDescription: text('meta_description'),
  featuredTestimonialId: text('featured_testimonial_id'),
  isFeatured: integer('is_featured', { mode: 'boolean' }).default(false),
  launchDate: integer('launch_date', { mode: 'timestamp' }),
  
  // Analytics & Performance
  totalViews: integer('total_views').default(0),
  totalPurchases: integer('total_purchases').default(0),
  conversionRate: real('conversion_rate').default(0.0),
  totalRevenueCents: integer('total_revenue_cents').default(0),
  
  // Version Control
  version: text('version').default('1.0'),
  changelog: text('changelog'),
  
  // Timestamps
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
  publishedAt: integer('published_at', { mode: 'timestamp' }),
  
  // Soft Delete
  deletedAt: integer('deleted_at', { mode: 'timestamp' }),
  
  // Full-text search support
  searchContent: text('search_content'),
});

// Platform-specific pricing and configuration
export const playbookPlatforms = sqliteTable('playbook_platforms', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  playbookId: text('playbook_id').references(() => playbooks.id, { onDelete: 'cascade' }).notNull(),
  platform: text('platform', { enum: ['stripe', 'lemonsqueezy', 'gumroad'] }).notNull(),
  externalProductId: text('external_product_id').notNull(),
  externalPriceId: text('external_price_id'),
  
  // Platform-specific pricing
  priceCents: integer('price_cents').notNull(),
  currency: text('currency').default('USD'),
  checkoutUrl: text('checkout_url'),
  
  // Platform-specific settings
  platformConfig: text('platform_config', { mode: 'json' }).$type<Record<string, any>>().default(JSON.stringify({})),
  
  // Status per platform
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  syncStatus: text('sync_status', { enum: ['synced', 'pending', 'error'] }).default('synced'),
  lastSyncedAt: integer('last_synced_at', { mode: 'timestamp' }),
  syncError: text('sync_error'),
  
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  uniquePlatform: unique().on(table.playbookId, table.platform),
}));

// Comprehensive analytics tracking
export const playbookAnalytics = sqliteTable('playbook_analytics', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  playbookId: text('playbook_id').references(() => playbooks.id, { onDelete: 'cascade' }),
  
  // Event Tracking
  eventType: text('event_type', { enum: ['view', 'add_to_cart', 'purchase', 'refund'] }).notNull(),
  platform: text('platform', { enum: ['stripe', 'lemonsqueezy', 'gumroad', 'website'] }),
  
  // User Context
  userId: text('user_id'),
  sessionId: text('session_id'),
  visitorId: text('visitor_id'),
  
  // Attribution
  referrerUrl: text('referrer_url'),
  utmSource: text('utm_source'),
  utmMedium: text('utm_medium'),
  utmCampaign: text('utm_campaign'),
  articleSlug: text('article_slug'),
  
  // Geographic & Technical
  countryCode: text('country_code'),
  deviceType: text('device_type', { enum: ['mobile', 'desktop', 'tablet'] }),
  userAgent: text('user_agent'),
  ipAddress: text('ip_address'),
  
  // Transaction Data
  revenueCents: integer('revenue_cents').default(0),
  currency: text('currency').default('USD'),
  externalTransactionId: text('external_transaction_id'),
  
  // Metadata
  metadata: text('metadata', { mode: 'json' }).$type<Record<string, any>>().default(JSON.stringify({})),
  
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// Customer testimonials and reviews
export const playbookTestimonials = sqliteTable('playbook_testimonials', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  playbookId: text('playbook_id').references(() => playbooks.id, { onDelete: 'cascade' }),
  
  // Customer Info
  customerEmail: text('customer_email'),
  customerName: text('customer_name'),
  customerTitle: text('customer_title'),
  
  // Review Content
  rating: integer('rating'), // 1-5 stars
  title: text('title'),
  content: text('content').notNull(),
  
  // Usage Context
  timeToValueDays: integer('time_to_value_days'),
  resultsAchieved: text('results_achieved'),
  
  // Social Proof
  isVerified: integer('is_verified', { mode: 'boolean' }).default(false),
  isFeatured: integer('is_featured', { mode: 'boolean' }).default(false),
  photoUrl: text('photo_url'),
  
  // Platform Context
  purchasePlatform: text('purchase_platform'),
  purchaseDate: integer('purchase_date', { mode: 'timestamp' }),
  
  // Moderation
  status: text('status', { enum: ['pending', 'approved', 'rejected'] }).default('pending'),
  moderatedBy: text('moderated_by'),
  moderatedAt: integer('moderated_at', { mode: 'timestamp' }),
  
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});

// A/B testing framework for playbooks
export const playbookExperiments = sqliteTable('playbook_experiments', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  playbookId: text('playbook_id').references(() => playbooks.id, { onDelete: 'cascade' }),
  
  // Experiment Details
  name: text('name').notNull(),
  description: text('description'),
  hypothesis: text('hypothesis'),
  
  // Test Configuration
  experimentType: text('experiment_type', { enum: ['pricing', 'description', 'images', 'checkout'] }).notNull(),
  status: text('status', { enum: ['draft', 'running', 'completed', 'paused'] }).default('draft'),
  
  // Traffic Allocation
  trafficPercent: integer('traffic_percent').default(50),
  
  // Test Variants (JSON)
  controlConfig: text('control_config', { mode: 'json' }).$type<Record<string, any>>().default(JSON.stringify({})),
  variantConfig: text('variant_config', { mode: 'json' }).$type<Record<string, any>>().default(JSON.stringify({})),
  
  // Success Metrics
  primaryMetric: text('primary_metric').default('conversion_rate'),
  
  // Results Tracking
  controlViews: integer('control_views').default(0),
  controlConversions: integer('control_conversions').default(0),
  variantViews: integer('variant_views').default(0),
  variantConversions: integer('variant_conversions').default(0),
  
  // Statistical Significance
  confidenceLevel: real('confidence_level').default(0.95),
  isSignificant: integer('is_significant', { mode: 'boolean' }).default(false),
  winner: text('winner', { enum: ['control', 'variant'] }),
  
  // Timing
  startDate: integer('start_date', { mode: 'timestamp' }),
  endDate: integer('end_date', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});

// Playbook content versions for change tracking
export const playbookVersions = sqliteTable('playbook_versions', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  playbookId: text('playbook_id').references(() => playbooks.id, { onDelete: 'cascade' }),
  
  // Version Info
  version: text('version').notNull(),
  versionType: text('version_type', { enum: ['major', 'minor', 'patch'] }).default('minor'),
  
  // Change Tracking - Snapshot of playbook at this version
  title: text('title').notNull(),
  headline: text('headline').notNull(),
  shortDescription: text('short_description').notNull(),
  longDescription: text('long_description'),
  featureBullets: text('feature_bullets', { mode: 'json' }).$type<string[]>().default(JSON.stringify([])),
  basePriceCents: integer('base_price_cents').notNull(),
  
  // Change Metadata
  changeSummary: text('change_summary'),
  changedBy: text('changed_by'),
  
  // Performance Comparison
  viewsThisVersion: integer('views_this_version').default(0),
  conversionsThisVersion: integer('conversions_this_version').default(0),
  revenueThisVersionCents: integer('revenue_this_version_cents').default(0),
  
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// Customer purchase history and journey tracking
export const playbookPurchases = sqliteTable('playbook_purchases', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  playbookId: text('playbook_id').references(() => playbooks.id),
  customerEmail: text('customer_email'),
  
  // Purchase Details
  platform: text('platform', { enum: ['stripe', 'lemonsqueezy', 'gumroad'] }).notNull(),
  externalTransactionId: text('external_transaction_id').notNull(),
  externalCustomerId: text('external_customer_id'),
  
  // Pricing
  amountCents: integer('amount_cents').notNull(),
  currency: text('currency').default('USD'),
  platformFeeCents: integer('platform_fee_cents').default(0),
  netRevenueCents: integer('net_revenue_cents').notNull(),
  
  // Attribution & Journey
  referrerUrl: text('referrer_url'),
  utmSource: text('utm_source'),
  utmMedium: text('utm_medium'),
  utmCampaign: text('utm_campaign'),
  articleSlug: text('article_slug'),
  timeFromFirstViewHours: integer('time_from_first_view_hours'),
  
  // Purchase Status
  status: text('status', { enum: ['completed', 'refunded', 'disputed'] }).default('completed'),
  refundReason: text('refund_reason'),
  refundedAt: integer('refunded_at', { mode: 'timestamp' }),
  refundAmountCents: integer('refund_amount_cents').default(0),
  
  // Customer Context
  isFirstPurchase: integer('is_first_purchase', { mode: 'boolean' }).default(true),
  customerLtvCents: integer('customer_ltv_cents').default(0),
  
  // Fulfillment
  downloadCount: integer('download_count').default(0),
  firstDownloadAt: integer('first_download_at', { mode: 'timestamp' }),
  lastDownloadAt: integer('last_download_at', { mode: 'timestamp' }),
  
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  uniqueTransaction: unique().on(table.platform, table.externalTransactionId),
}));

// Integration with existing newsletter system
export const newsletterPlaybookInteractions = sqliteTable('newsletter_playbook_interactions', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  subscriberId: text('subscriber_id').references(() => newsletterSubscribers.id),
  playbookId: text('playbook_id').references(() => playbooks.id),
  
  // Interaction Type
  interactionType: text('interaction_type', { enum: ['viewed', 'added_to_cart', 'purchased'] }).notNull(),
  platform: text('platform'),
  
  // Context
  articleSlug: text('article_slug'),
  emailCampaignId: text('email_campaign_id'),
  
  // Metadata
  metadata: text('metadata', { mode: 'json' }).$type<Record<string, any>>().default(JSON.stringify({})),
  
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// Type exports for playbook system
export type Playbook = typeof playbooks.$inferSelect;
export type NewPlaybook = typeof playbooks.$inferInsert;

export type PlaybookPlatform = typeof playbookPlatforms.$inferSelect;
export type NewPlaybookPlatform = typeof playbookPlatforms.$inferInsert;

export type PlaybookAnalytics = typeof playbookAnalytics.$inferSelect;
export type NewPlaybookAnalytics = typeof playbookAnalytics.$inferInsert;

export type PlaybookTestimonial = typeof playbookTestimonials.$inferSelect;
export type NewPlaybookTestimonial = typeof playbookTestimonials.$inferInsert;

export type PlaybookExperiment = typeof playbookExperiments.$inferSelect;
export type NewPlaybookExperiment = typeof playbookExperiments.$inferInsert;

export type PlaybookVersion = typeof playbookVersions.$inferSelect;
export type NewPlaybookVersion = typeof playbookVersions.$inferInsert;

export type PlaybookPurchase = typeof playbookPurchases.$inferSelect;
export type NewPlaybookPurchase = typeof playbookPurchases.$inferInsert;

export type NewsletterPlaybookInteraction = typeof newsletterPlaybookInteractions.$inferSelect;
export type NewNewsletterPlaybookInteraction = typeof newsletterPlaybookInteractions.$inferInsert;