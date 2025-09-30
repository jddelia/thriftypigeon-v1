CREATE TABLE `email_campaigns` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`subject` text NOT NULL,
	`template_name` text NOT NULL,
	`recipient_count` integer DEFAULT 0,
	`status` text DEFAULT 'draft' NOT NULL,
	`scheduled_at` integer,
	`started_at` integer,
	`completed_at` integer,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`email_content_html` text,
	`email_content_text` text,
	`total_sent` integer DEFAULT 0,
	`total_delivered` integer DEFAULT 0,
	`total_opened` integer DEFAULT 0,
	`total_clicked` integer DEFAULT 0,
	`total_bounced` integer DEFAULT 0,
	`total_complained` integer DEFAULT 0,
	`total_unsubscribed` integer DEFAULT 0,
	`created_by` text DEFAULT 'system',
	`notes` text
);
--> statement-breakpoint
CREATE TABLE `email_deliveries` (
	`id` text PRIMARY KEY NOT NULL,
	`campaign_id` text,
	`subscriber_id` text,
	`resend_email_id` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`sent_at` integer,
	`delivered_at` integer,
	`first_opened_at` integer,
	`last_opened_at` integer,
	`total_opens` integer DEFAULT 0,
	`total_clicks` integer DEFAULT 0,
	`bounce_reason` text,
	`complaint_reason` text,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`tracking_data` text DEFAULT '{}',
	FOREIGN KEY (`campaign_id`) REFERENCES `email_campaigns`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`subscriber_id`) REFERENCES `newsletter_subscribers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `email_templates` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`subject_template` text NOT NULL,
	`html_template` text NOT NULL,
	`text_template` text,
	`template_variables` text DEFAULT '["firstName","unsubscribeUrl"]',
	`category` text DEFAULT 'newsletter' NOT NULL,
	`is_active` integer DEFAULT true,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP,
	`a_b_test_variants` text DEFAULT '{}',
	`total_sent` integer DEFAULT 0,
	`avg_open_rate` real DEFAULT 0,
	`avg_click_rate` real DEFAULT 0
);
--> statement-breakpoint
CREATE UNIQUE INDEX `email_templates_name_unique` ON `email_templates` (`name`);--> statement-breakpoint
CREATE TABLE `newsletter_issues` (
	`id` text PRIMARY KEY NOT NULL,
	`issue_number` integer,
	`title` text NOT NULL,
	`subject_line` text NOT NULL,
	`featured_article_url` text,
	`featured_article_title` text,
	`additional_content` text DEFAULT '{}',
	`status` text DEFAULT 'draft',
	`scheduled_send_date` integer,
	`actual_send_date` integer,
	`recipient_count` integer DEFAULT 0,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `newsletter_issues_issue_number_unique` ON `newsletter_issues` (`issue_number`);--> statement-breakpoint
CREATE TABLE `newsletter_subscribers` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`first_name` text,
	`last_name` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`source` text DEFAULT 'website' NOT NULL,
	`signup_ip` text,
	`signup_user_agent` text,
	`double_opt_in_token` text,
	`double_opt_in_confirmed_at` integer,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP,
	`unsubscribed_at` integer,
	`unsubscribe_reason` text,
	`gdpr_consent` integer DEFAULT false,
	`gdpr_consent_date` integer,
	`email_preferences` text DEFAULT '{"newsletter":true,"marketing":false,"productUpdates":true}',
	`total_emails_sent` integer DEFAULT 0,
	`total_emails_opened` integer DEFAULT 0,
	`total_emails_clicked` integer DEFAULT 0,
	`last_email_sent_at` integer,
	`last_email_opened_at` integer,
	`tags` text DEFAULT '[]',
	`segment` text,
	`lifetime_value_cents` integer DEFAULT 0
);
--> statement-breakpoint
CREATE UNIQUE INDEX `newsletter_subscribers_email_unique` ON `newsletter_subscribers` (`email`);--> statement-breakpoint
CREATE TABLE `signup_sources` (
	`id` text PRIMARY KEY NOT NULL,
	`source_name` text NOT NULL,
	`page_url` text,
	`referrer` text,
	`utm_source` text,
	`utm_medium` text,
	`utm_campaign` text,
	`signup_count` integer DEFAULT 0,
	`conversion_rate` real DEFAULT 0,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
