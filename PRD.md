# Product Requirements Document — **Playbook Mint** (MVP v2)
## Content-First Micro-Playbook Platform

---

## 0) One-liner

**Playbook Mint** is a high-traffic content site where visitors read free how-to guides and listicles, then impulse-buy embedded $5-$9 "extended playbooks" (detailed PDF blueprints) for topics that resonate. Think: *"Great free article → I want the full system → $5 → instant download."*

---

## 1) Goals & non-goals

### Goals (MVP)

* **G1:** Publish **SEO-optimized how-to articles and listicles** (10-20 articles at launch) that rank and drive traffic.
* **G2:** **Embed micro-playbook CTAs** within articles at natural decision points (not salesy, contextual).
* **G3:** Sell playbooks at **$5-$9** via **Lemon Squeezy** (handles tax, affiliate-ready, minimal dev).
* **G4:** **Instant fulfillment** via email with direct download link.
* **G5:** **Capture emails aggressively**: newsletter signups + purchase emails = owned audience.
* **G6:** Track **content → CTA → purchase funnel** (Plausible + PostHog).
* **G7:** **Impulse purchase optimization**: low friction, clear value, instant gratification.

### Non-Goals (intentionally out for MVP)

* User accounts or login ("My Library" comes later)
* Subscriptions or membership tiers
* Complex CMS (we're using **MDX in repo**)
* Multi-product carts or upsells
* Video courses or community features
* Affiliate program (Lemon Squeezy has it, but not activating yet)

---

## 2) Target users & JTBD

**Primary:** **Motivated searchers** (hobby enthusiasts, side-hustlers, DIYers, students) who land via Google/Pinterest looking for solutions.

**JTBD:** *"I found this helpful article, but I want the complete system/templates/checklist without doing more research. $5? Sure, if it saves me 2 hours."*

**Psychographic:** Values execution over theory. Will pay small amounts for convenience and completeness.

---

## 3) Value proposition & positioning

### Free content strategy
* **Comprehensive how-to guides** (1,500-3,000 words)
* **Listicles** ("7 Ways to...", "15 Tools for...")
* **Comparison posts** ("X vs Y: Complete Guide")
* Goal: Answer the search intent completely, build trust, make them *want* more depth

### Paid playbook positioning
* **$5-$9 impulse purchase** (price of a coffee)
* **"Extended Playbook"** = the article on steroids:
  - Step-by-step implementation guide
  - Downloadable templates/spreadsheets
  - Checklists and worksheets
  - Resource lists and vendor recommendations
  - Bonus: Email scripts, calculators, diagrams
* Promise: *"Skip 5 hours of Googling. Get the complete system for $5."*

---

## 4) Content strategy (detailed)

### 4.1 Article structure (repeatable template)

**Every article follows this flow:**

1. **Hook** (problem/pain point) → 150 words
2. **Overview/Listicle** → 800-1,500 words
3. **🎯 Embedded Playbook CTA #1** → appears at 40% scroll depth
   - "Want the complete step-by-step system? Get the Extended Playbook ($5)"
4. **Deeper dive** → 500-800 words (more detail on best options)
5. **🎯 Embedded Playbook CTA #2** → natural transition point
6. **FAQ/Tips section** → 300-500 words
7. **Footer CTA** → "Get the Extended Playbook" + newsletter signup

**Key principle:** Free content is *genuinely useful*. Playbook is for people who want to *implement immediately*.

### 4.2 Content types & playbook pairing

| Article Type | Example | Playbook Offer |
|--------------|---------|----------------|
| **How-to guide** | "How to Start a Newsletter in 2025" | "Newsletter Launch Playbook: 30-Day System + Templates" ($7) |
| **Listicle** | "15 Ways to Cut Your Grocery Bill" | "Grocery Savings Playbook: Meal Plans + Budget Tracker" ($5) |
| **Comparison** | "ConvertKit vs Mailchimp: 2025 Guide" | "Email Marketing Setup Playbook: Platform Checklists" ($5) |
| **Tool roundup** | "Best Budgeting Apps for 2025" | "Personal Finance Setup Playbook: Spreadsheets + Automation" ($7) |

### 4.3 Launch content plan (Week 1-2)

**Batch 1: Money/Finance** (3 articles + 3 playbooks)
- "How to Build an Emergency Fund on Any Income" → *Emergency Fund Playbook* ($5)
- "15 Ways to Reduce Monthly Bills Without Sacrificing Lifestyle" → *Bill Reduction Playbook* ($5)
- "Best Budgeting Methods Compared: 50/30/20 vs Zero-Based vs Envelope" → *Budgeting Systems Playbook* ($7)

**Batch 2: Productivity/Side Hustles** (2 articles + 2 playbooks)
- "How to Start Freelancing While Keeping Your Day Job" → *Side Hustle Launch Playbook* ($7)
- "21 Productivity Systems That Actually Work" → *Productivity Stack Playbook* ($5)

**Target:** 5 articles + 5 playbooks live at launch. Add 2-3/week thereafter.

### 4.4 SEO requirements per article

- **Primary keyword** in title, H1, first 100 words
- **Long-tail variations** in H2s and throughout
- **Internal links** to 2-3 related articles
- **External links** to 3-5 authoritative sources
- **Meta description** (140-155 chars, includes benefit + CTA)
- **Alt text** on all images with keyword variations
- **Schema markup:** Article schema with author, date, image
- **URL structure:** `/how-to-start-freelancing`, `/best-budgeting-apps`

---

## 5) User flows & wireframe notes

### 5.1 Primary conversion flow

```
Google search
    ↓
Article page (free content)
    ↓
Scroll to embedded CTA (~40% depth)
    ↓
Click "Get the Extended Playbook" button
    ↓
Inline modal/slide-over (no page redirect):
    - Playbook cover image
    - "What's included" bullets (5-6 items)
    - Price: $5 or $7
    - Email input (pre-fill if newsletter signup)
    - "Get Instant Access" button
    ↓
Lemon Squeezy checkout (embedded overlay)
    ↓
Purchase complete
    ↓
Thank-you page:
    - Confirmation message
    - Big "Download Now" button
    - "Check your email" message
    - Upsell: Newsletter signup if not subscribed
    ↓
Email arrives within 60 seconds:
    - Download button
    - Direct link (no login needed)
    - Support contact
```

### 5.2 Email capture flow (secondary goal)

```
Visit article
    ↓
Exit intent trigger OR scroll 70%
    ↓
Email popup:
    "Get our best guides + exclusive playbook discounts"
    [Email input]
    [Subscribe button]
    ↓
Welcome email sequence:
    - Email 1 (immediate): Welcome + best articles
    - Email 2 (day 3): Top playbook recommendation
    - Email 3 (day 7): New content roundup
```

---

## 6) Success metrics & targets

### North Star Metric
**Monthly Revenue** = (Traffic × Conversion Rate × Average Order Value)
- Target by Week 8: **$500/month** (e.g., 5,000 visitors × 2% CVR × $5 = $500)
- Target by Month 6: **$2,000/month** (20,000 visitors × 2% CVR × $5)

### Supporting Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Article → Purchase CVR** | ≥ 1.5% | PostHog funnel |
| **CTA Click Rate** | ≥ 8% | Embedded CTA clicks / pageviews |
| **Checkout → Purchase** | ≥ 85% | Lemon Squeezy analytics |
| **Email Capture Rate** | ≥ 12% | Newsletter signups / unique visitors |
| **Avg. Time on Page** | ≥ 3 min | Plausible |
| **Email Open Rate** | ≥ 35% | Resend analytics |
| **Refund Rate** | ≤ 5% | Lemon Squeezy |

### Performance Budgets
- **LCP:** < 2.5s (75th percentile, 4G)
- **CLS:** < 0.1
- **FID/INP:** < 200ms
- **Mobile experience:** 90+ Lighthouse score

---

## 7) System architecture (refined)

### 7.1 Stack (simplified for speed)

* **Framework:** Next.js 14+ (App Router) on **Vercel**
* **Content:** **MDX** in `/content` directory (no database)
* **Styling:** **Tailwind CSS** + **shadcn/ui** components
* **Payments:** **Lemon Squeezy** (handles tax, EU VAT, compliance)
* **Database:** **Neon Postgres** (serverless) + **Drizzle ORM**
* **Email:** **Resend** (transactional + marketing)
* **Storage:** **Cloudflare R2** (cheaper than S3 for downloads)
* **Analytics:** **Plausible** (cookieless) + **PostHog** (events)
* **Forms:** **React Hook Form** + **Zod** validation
* **Anti-abuse:** **Cloudflare Turnstile** + rate limiting

### 7.2 Simplified data model

```typescript
// drizzle/schema.ts

export const customers = pgTable('customers', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }),
  newsletterOptIn: boolean('newsletter_opt_in').default(false),
  lemonSqueezyCustomerId: varchar('lemon_squeezy_customer_id', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  customerId: integer('customer_id').references(() => customers.id).notNull(),
  productSku: varchar('product_sku', { length: 128 }).notNull(), // e.g., "pb-emergency-fund"
  productName: varchar('product_name', { length: 255 }).notNull(),
  amountCents: integer('amount_cents').notNull(),
  currency: varchar('currency', { length: 8 }).default('USD').notNull(),
  status: varchar('status', { length: 32 }).notNull(), // paid/refunded
  lemonSqueezyOrderId: varchar('lemon_squeezy_order_id', { length: 255 }).notNull().unique(),
  receiptUrl: varchar('receipt_url', { length: 2048 }),
  downloadCount: integer('download_count').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const downloads = pgTable('downloads', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').references(() => orders.id).notNull(),
  fileKey: varchar('file_key', { length: 512 }).notNull(),
  ipAddress: varchar('ip_address', { length: 64 }),
  userAgent: varchar('user_agent', { length: 512 }),
  downloadedAt: timestamp('downloaded_at').defaultNow().notNull()
});

export const emailSubscribers = pgTable('email_subscribers', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  status: varchar('status', { length: 32 }).default('active').notNull(), // active/unsubscribed
  source: varchar('source', { length: 64 }).notNull(), // popup/purchase/footer
  subscribedAt: timestamp('subscribed_at').defaultNow().notNull()
});
```

### 7.3 Content structure (MDX frontmatter)

```yaml
---
title: "How to Build an Emergency Fund on Any Income"
slug: "how-to-build-emergency-fund"
description: "A practical guide to building a $1,000-$10,000 emergency fund, even on a tight budget. Step-by-step strategies that actually work."
publishedAt: "2025-09-15"
updatedAt: "2025-09-20"
author: "Your Name"
category: "personal-finance"
tags: ["emergency fund", "savings", "budgeting", "financial planning"]

# Playbook details (if article has one)
hasPlaybook: true
playbookSku: "pb-emergency-fund"
playbookTitle: "Emergency Fund Playbook: 90-Day System"
playbookPrice: 500  # cents
playbookLemonSqueezyId: "prod_123456"
playbookDescription: "Complete 90-day system with budgeting templates, savings trackers, and automation scripts."
playbookFileKey: "playbooks/emergency-fund-v1.pdf"
playbookIncludes:
  - "90-day step-by-step roadmap"
  - "Budget calculator spreadsheet"
  - "Automated savings setup guide"
  - "Side income ideas checklist"
  - "Progress tracking dashboard"
  - "Email templates for bill negotiations"

# SEO
metaTitle: "How to Build an Emergency Fund on Any Income (2025 Guide)"
metaDescription: "Build a $1,000-$10,000 emergency fund with this proven system. Works on any income level. Includes free templates and savings strategies."
canonicalUrl: "/how-to-build-emergency-fund"
ogImage: "/og/emergency-fund.png"

# Content settings
readingTime: 8  # minutes
showTableOfContents: true
ctaPositions: ["inline-1", "inline-2", "footer"]  # where to show playbook CTAs
relatedArticles: ["best-budgeting-apps", "reduce-monthly-bills"]
---
```

### 7.4 API endpoints

**Payment & fulfillment:**
```
POST /api/lemon-squeezy/webhook
  - Verify signature
  - Handle order.created, order.refunded events
  - Upsert customer + order
  - Trigger email with download link
  - Rate limit: exempt (Lemon Squeezy IPs)

GET /api/download/[orderId]/[fileKey]
  - Validate order exists, status = paid
  - Increment download count
  - Log download event
  - 302 redirect to signed R2 URL (expires 15 min)
  - Rate limit: 10/hour per IP
```

**Email & newsletter:**
```
POST /api/subscribe
  - Body: { email, source }
  - Validate email format
  - Check for duplicates
  - Insert into emailSubscribers
  - Trigger welcome email sequence
  - Rate limit: 5/min per IP

POST /api/unsubscribe
  - Body: { email, token }
  - Verify token
  - Update status to unsubscribed
```

**Analytics:**
```
POST /api/track
  - Body: { event, properties }
  - Send to PostHog
  - Rate limit: 60/min per IP
```

### 7.5 Email templates (Resend)

**1. Download/Receipt Email**
```
Subject: Your [Playbook Title] is ready 📥

Hi there,

Thanks for grabbing the [Playbook Title]! Here's your download:

[BIG BUTTON: Download Your Playbook]

Direct link: [URL]

This download link works for 30 days and you can re-download anytime.

What's inside:
• [Benefit 1]
• [Benefit 2]
• [Benefit 3]

Questions? Just reply to this email.

Best,
[Your Name]
Playbook Mint

P.S. Check out these related guides:
→ [Article 1]
→ [Article 2]
```

**2. Welcome Email (Newsletter)**
```
Subject: Welcome to Playbook Mint! Here's what you need 👋

[Friendly intro]

Here are our most popular guides to get you started:
→ [Top Article 1]
→ [Top Article 2]
→ [Top Article 3]

🎁 Special offer: Get any playbook for $4 (save $1-3) using code WELCOME
```

**3. Weekly Newsletter Template**
```
Subject: [Engaging headline based on latest content]

Hey [First Name],

This week's highlights:

📖 New Guide: [Article Title]
[1-sentence description + link]

💡 Quick Tip: [Actionable tip]

🔥 Most Popular: [Best performing article]

[CTA to featured playbook]
```

---

## 8) User stories & acceptance criteria

### Reader/Visitor

**US-V1:** As a reader, I can find your article via Google search
- **AC:** Title tags, meta descriptions optimized; page loads in < 2.5s; mobile-friendly

**US-V2:** I can read the full article without hitting a paywall
- **AC:** No login required; no "read more" gates; entire article visible

**US-V3:** I see clear value in the playbook offer without feeling tricked
- **AC:** CTA explains what's *extra* in playbook; free content is genuinely complete

### Buyer

**US-B1:** I can purchase a playbook in < 30 seconds
- **AC:** Click CTA → enter email → click "Get Access" → Lemon Squeezy overlay → done

**US-B2:** I get my download immediately after purchase
- **AC:** Thank-you page shows download button; email arrives within 60s

**US-B3:** The download link works on any device
- **AC:** Signed URL works on mobile/desktop; no login required; expires after 30 days with re-download option

**US-B4:** I can get a refund easily if unsatisfied
- **AC:** Reply to email within 7 days → refund processed in 24 hours

### Newsletter Subscriber

**US-N1:** I can subscribe without purchasing
- **AC:** Popup, footer, and inline newsletter forms on every article

**US-N2:** I get valuable emails, not spam
- **AC:** 1 email per week max; can unsubscribe in one click; no selling emails to third parties

### Operator (You)

**US-O1:** I can publish a new article in < 15 minutes
- **AC:** Create MDX file → add frontmatter → commit → auto-deploy → live

**US-O2:** I can update a playbook PDF without breaking old orders
- **AC:** Upload new version to R2 with same fileKey → old buyers get new version

**US-O3:** I can see which articles drive the most sales
- **AC:** Dashboard shows: pageviews, CTA clicks, purchases per article SKU

**US-O4:** I can manually issue a refund and resend download links
- **AC:** Admin page with search by email → actions: refund, resend email

---

## 9) Design & UX specifications

### 9.1 Article page layout

```
┌─────────────────────────────────┐
│  HEADER: Logo | Articles | About│
├─────────────────────────────────┤
│  Article Title (H1)              │
│  Subtitle | Reading time | Date  │
│  Author | Category                │
├─────────────────────────────────┤
│  [Hero image]                    │
├─────────────────────────────────┤
│  Table of Contents (sticky)      │
├─────────────────────────────────┤
│  Article content (MDX)           │
│                                   │
│  ┌──────────────────────────┐   │
│  │  📚 PLAYBOOK CTA CARD     │   │
│  │  Title + "What's Included"│   │
│  │  Price badge               │   │
│  │  [Get Playbook Button]     │   │
│  └──────────────────────────┘   │
│                                   │
│  More article content...         │
│                                   │
│  ┌──────────────────────────┐   │
│  │  2ND CTA (if needed)      │   │
│  └──────────────────────────┘   │
│                                   │
│  FAQ section                     │
├─────────────────────────────────┤
│  FOOTER CTA + NEWSLETTER         │
│  Related Articles                │
│  Footer links                    │
└─────────────────────────────────┘
```

### 9.2 Playbook CTA card specs

**Visual hierarchy:**
- Subtle background color (not screaming yellow)
- Small "Extended Playbook" badge
- Benefit-driven headline (not "Buy now")
- 5-6 checkmark bullets showing what's included
- Price in bold: "$5" (not "$5.00")
- Button text: "Get Instant Access" or "Get the Playbook"

**Example:**
```
┌────────────────────────────────────────┐
│ 📚 EXTENDED PLAYBOOK                    │
│                                         │
│ Emergency Fund Playbook: 90-Day System  │
│                                         │
│ ✓ Step-by-step 90-day roadmap          │
│ ✓ Budget calculator spreadsheet        │
│ ✓ Automated savings setup guide        │
│ ✓ Side income ideas checklist          │
│ ✓ Progress tracker + email templates   │
│                                         │
│           $5  [Get Instant Access]      │
└────────────────────────────────────────┘
```

### 9.3 Checkout modal (Lemon Squeezy embed)

- Appears as overlay (doesn't navigate away)
- Shows product name, price, email input
- One-click purchase with saved payment method
- Apple Pay / Google Pay enabled
- Loading state while processing

### 9.4 Thank-you page

```
✅ Success! Check your email

Your [Playbook Title] is ready.

[DOWNLOAD NOW] ← big button

We've also sent a download link to [email].

────────────────────

📧 Want more guides like this?
[Subscribe to newsletter]

────────────────────

Questions? Email support@playbookmint.com
```

---

## 10) Analytics & tracking plan (detailed)

### 10.1 PostHog events

**Content engagement:**
```javascript
posthog.capture('article_view', {
  slug: 'how-to-build-emergency-fund',
  category: 'personal-finance',
  hasPlaybook: true,
  playbookSku: 'pb-emergency-fund'
});

posthog.capture('cta_impression', {
  slug: 'how-to-build-emergency-fund',
  position: 'inline-1',  // inline-1, inline-2, footer
  playbookSku: 'pb-emergency-fund',
  scrollDepth: 42  // percentage
});

posthog.capture('cta_click', {
  slug: 'how-to-build-emergency-fund',
  position: 'inline-1',
  playbookSku: 'pb-emergency-fund',
  price: 500
});
```

**Conversion funnel:**
```javascript
posthog.capture('checkout_started', {
  playbookSku: 'pb-emergency-fund',
  price: 500,
  referringArticle: 'how-to-build-emergency-fund'
});

posthog.capture('purchase_completed', {
  orderId: 12345,
  playbookSku: 'pb-emergency-fund',
  amount: 500,
  currency: 'USD',
  referringArticle: 'how-to-build-emergency-fund'
});

posthog.capture('download_clicked', {
  orderId: 12345,
  playbookSku: 'pb-emergency-fund',
  source: 'thank_you_page' // or 'email'
});
```

**Email capture:**
```javascript
posthog.capture('newsletter_signup', {
  source: 'exit_intent',  // exit_intent, footer, inline, purchase
  fromArticle: 'how-to-build-emergency-fund'
});
```

### 10.2 Plausible goals

- Pageview: `/thank-you/*`
- Custom event: `CTA Click`
- Custom event: `Purchase`
- Custom event: `Newsletter Signup`
- Outbound link: Download clicks

### 10.3 Dashboard views

**Weekly review dashboard:**
1. **Traffic:** Sessions, pageviews, top articles
2. **Conversion funnel:**
   - Article views → CTA clicks (goal: 8%)
   - CTA clicks → Checkout starts (goal: 60%)
   - Checkout starts → Purchases (goal: 85%)
3. **Revenue:** Total, by playbook, by article
4. **Email growth:** New subscribers, unsubscribes, open rates
5. **Content performance:** Top articles by traffic, CTA CTR, revenue

---

## 11) SEO & content distribution

### 11.1 On-page SEO checklist (per article)

- [ ] Primary keyword in: title, URL, H1, first 100 words, meta description
- [ ] 2-3 keyword variations in H2/H3 subheadings
- [ ] Internal links to 3-4 related articles (contextual, not footer)
- [ ] External links to 3-5 authoritative sources (open in new tab)
- [ ] All images: compressed (< 200KB), WebP format, descriptive alt text
- [ ] Schema markup: Article, FAQPage (if FAQ section)
- [ ] Meta description: 140-155 chars, includes benefit + year
- [ ] OG tags: title, description, image (1200×630)
- [ ] Twitter card tags
- [ ] Canonical URL set correctly

### 11.2 Content distribution strategy

**Week 1-4 (Launch & SEO foundation)**
- Publish 5 articles + 5 playbooks
- Submit to Google Search Console
- Share on personal social (Twitter, LinkedIn)
- Post in 2-3 relevant subreddits (value-first, no spam)
- Email to personal network

**Month 2-3 (Traffic building)**
- Publish 2-3 articles per week
- Guest post on 1-2 complementary blogs (with backlinks)
- Answer 5-10 Quora/Reddit questions per week (link when genuinely helpful)
- Pinterest pins for visual articles (listicles work great)
- Engage in relevant Facebook groups/Discord communities

**Month 4+ (Scaling)**
- Podcast interviews (mention site naturally)
- Paid newsletter sponsorships ($50-200 per mention)
- Strategic backlink outreach (broken link building, resource pages)
- Repurpose top articles into Twitter threads, LinkedIn carousels

### 11.3 Keyword strategy

**Target mix per 10 articles:**
- 3 **high-volume, medium-competition** (10K-50K searches/mo)
- 5 **medium-volume, low-competition** (1K-10K searches/mo)
- 2 **long-tail, ultra-specific** (100-1K searches/mo, high intent)

**Examples:**
- High-volume: "how to budget" (medium-hard)
- Medium-volume: "how to build emergency fund" (easier)
- Long-tail: "how to save $1000 in 3 months" (high intent)

---

## 12) Monetization & pricing strategy

### 12.1 Playbook pricing tiers

**Initial structure:**
- **Starter playbooks:** $5 (15-20 pages, 1-2 templates)
- **Standard playbooks:** $7 (25-35 pages, 3-5 templates)
- **Comprehensive playbooks:** $9 (40+ pages, full system)

**Testing plan:**
- Week 1-4: All at $5 to test conversion
- Week 5-8: A/B test $5 vs $7 on same playbook
- Month 3+: Tiered pricing based on depth

### 12.2 Revenue projections (conservative)

**Month 1:** 1,000 visitors × 1.5% CVR × $5 = **$75**
**Month 3:** 5,000 visitors × 2% CVR × $5 = **$500**
**Month 6:** 15,000 visitors × 2.5% CVR × $5.50 avg = **$2,062**
**Month 12:** 40,000 visitors × 3% CVR × $6 avg = **$7,200**

### 12.3 Future monetization (post-MVP)

- **Playbook bundles:** 3 for $15 (vs $15-21 individually)
- **Newsletter sponsorships:** Once at 5,000+ subscribers
- **Affiliate links:** In articles (Amazon, software tools)
- **Premium membership:** $9/mo for all playbooks (once library is 20+)

---

## 13) Technical implementation details

### 13.1 Lemon Squeezy integration

**Setup:**
1. Create products in LS dashboard (one per playbook)
2. Set up webhook endpoint
3. Add webhook URL to LS settings
4. Store product IDs in MDX frontmatter

**Checkout flow:**
```typescript
// app/api/checkout/route.ts
export async function POST(req: Request) {
  const { email, playbookSku, variantId } = await req.json();

  const checkout = await lemonSqueezy.createCheckout({
    productVariantId: variantId,
    checkoutData: {
      email,
      custom: { playbookSku, articleSlug: req.headers.get('referer') }
    },
    expiresAt: new Date(Date.now() + 1000 * 60 * 60), // 1 hour
    embed: true
  });

  return Response.json({ checkoutUrl: checkout.data.attributes.url });
}
```

**Webhook handler:**
```typescript
// app/api/lemon-squeezy/webhook/route.ts
export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('X-Signature');

  // Verify signature
  const isValid = verifySignature(body, signature, process.env.LS_WEBHOOK_SECRET!);
  if (!isValid) return Response.json({ error: 'Invalid signature' }, { status: 401 });

  const event = JSON.parse(body);

  if (event.meta.event_name === 'order_created') {
    const { email, custom } = event.data.attributes;
    const { playbookSku } = custom;

    // Create/update customer
    const customer = await db.insert(customers)
      .values({ email, lemonSqueezyCustomerId: event.data.attributes.customer_id })
      .onConflictDoUpdate({ target: customers.email, set: { lemonSqueezyCustomerId } });

    // Create order
    const order = await db.insert(orders).values({
      customerId: customer.id,
      productSku: playbookSku,
      amountCents: event.data.attributes.total,
      lemonSqueezyOrderId: event.data.id,
      status: 'paid'
    }).returning();

    // Send email with download link
    await sendDownloadEmail(order[0]);
  }

  return Response.json({ received: true });
}
```

### 13.2 Download endpoint with security

```typescript
// app/api/download/[orderId]/[fileKey]/route.ts
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand } from '@aws-sdk/client-s3';

export async function GET(
  req: Request,
  { params }: { params: { orderId: string; fileKey: string } }
) {
  // Rate limiting check (10/hour per IP)
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  const rateLimitOk = await checkRateLimit(ip, 'download', 10, 3600);
  if (!rateLimitOk) {
    return Response.json({ error: 'Too many downloads' }, { status: 429 });
  }

  // Validate order
  const order = await db.query.orders.findFirst({
    where: eq(orders.id, parseInt(params.orderId)),
    with: { customer: true }
  });

  if (!order || order.status !== 'paid') {
    return Response.json({ error: 'Invalid order' }, { status: 403 });
  }

  // Verify file belongs to this order's SKU
  const playbook = getPlaybookBySku(order.productSku);
  if (playbook.fileKey !== params.fileKey) {
    return Response.json({ error: 'File not found' }, { status: 404 });
  }

  // Log download
  await db.insert(downloads).values({
    orderId: order.id,
    fileKey: params.fileKey,
    ipAddress: ip,
    userAgent: req.headers.get('user-agent')
  });

  // Increment download count
  await db.update(orders)
    .set({ downloadCount: order.downloadCount + 1 })
    .where(eq(orders.id, order.id));

  // Generate signed URL (15 min expiry)
  const command = new GetObjectCommand({
    Bucket: process.env.R2_BUCKET,
    Key: params.fileKey
  });
  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 900 });

  // Redirect to signed URL
  return Response.redirect(signedUrl, 302);
}
```

### 13.3 Email sequences (Resend + React Email)

```typescript
// emails/DownloadEmail.tsx
import { Button, Html, Head, Body, Container, Section, Text, Hr } from '@react-email/components';

export function DownloadEmail({ order, customer, downloadUrl, playbook }) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Text style={heading}>Your {playbook.title} is ready! 📥</Text>

          <Text style={paragraph}>
            Hi there,
          </Text>

          <Text style={paragraph}>
            Thanks for grabbing the {playbook.title}. Here's your download:
          </Text>

          <Section style={buttonContainer}>
            <Button style={button} href={downloadUrl}>
              Download Your Playbook
            </Button>
          </Section>

          <Text style={paragraph}>
            Or copy this link: <br />
            <a href={downloadUrl}>{downloadUrl}</a>
          </Text>

          <Hr style={hr} />

          <Text style={paragraph}>
            <strong>What's inside:</strong>
          </Text>
          <ul>
            {playbook.includes.map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <Hr style={hr} />

          <Text style={footer}>
            Questions? Just reply to this email.
            <br />
            Order #{order.id} • Receipt: <a href={order.receiptUrl}>View receipt</a>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
```

### 13.4 Rate limiting middleware

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const rateLimits = new Map<string, number[]>();

export function middleware(req: NextRequest) {
  // Only rate limit specific paths
  if (req.nextUrl.pathname.startsWith('/api/download') ||
      req.nextUrl.pathname.startsWith('/api/subscribe')) {

    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    const windowMs = 60 * 60 * 1000; // 1 hour
    const maxRequests = req.nextUrl.pathname.includes('download') ? 10 : 5;

    const requests = rateLimits.get(ip) || [];
    const recentRequests = requests.filter(time => now - time < windowMs);

    if (recentRequests.length >= maxRequests) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    rateLimits.set(ip, [...recentRequests, now]);
  }

  return NextResponse.next();
}
```

---

## 14) Content quality checklist

Every article must pass this before publish:

**Structure & readability:**
- [ ] Hook grabs attention in first 150 words
- [ ] Subheadings every 300-400 words
- [ ] Paragraphs ≤ 4 lines
- [ ] Bullet points and numbered lists for scannability
- [ ] At least 2 images or diagrams
- [ ] Reading level: 8th grade (Hemingway score ≤ 10)

**Value & accuracy:**
- [ ] Fully answers the search query
- [ ] All facts verified with sources
- [ ] Examples are specific and actionable
- [ ] No fluff or filler content
- [ ] Links to authoritative external sources
- [ ] Internal links to related articles

**Conversion optimization:**
- [ ] Playbook CTA appears at natural transition (not abrupt)
- [ ] CTA clearly explains what's *extra* in playbook
- [ ] "What's included" bullets are benefit-driven
- [ ] Price anchored appropriately ("less than a coffee")
- [ ] Newsletter signup in footer

---

## 15) Launch checklist (Week 1-2)

### Technical setup
- [ ] Next.js project initialized with Tailwind + shadcn/ui
- [ ] Neon database created + Drizzle schema deployed
- [ ] Lemon Squeezy account + products created
- [ ] Cloudflare R2 bucket configured (private)
- [ ] Resend account + domain verified (DMARC/SPF/DKIM)
- [ ] Plausible + PostHog integrated
- [ ] Environment variables configured on Vercel
- [ ] Custom domain connected + SSL working

### Content ready
- [ ] 5 articles written and edited
- [ ] 5 playbook PDFs created (with branding)
- [ ] All images optimized (WebP, < 200KB)
- [ ] Frontmatter complete for all articles
- [ ] Legal pages: Privacy, Terms, Refund policy
- [ ] About page with story + author bio

### Testing
- [ ] Test purchase flow end-to-end (real payment)
- [ ] Verify email delivery (Gmail, Outlook, Apple Mail)
- [ ] Test download on mobile + desktop
- [ ] Check all CTAs track correctly in PostHog
- [ ] Lighthouse scores: Performance 90+, Accessibility 95+
- [ ] Cross-browser testing (Chrome, Safari, Firefox)

### SEO & distribution
- [ ] Google Search Console verified + sitemap submitted
- [ ] Google Analytics (optional backup to Plausible)
- [ ] Social media accounts created (Twitter, LinkedIn minimum)
- [ ] Email signature updated with site link
- [ ] 5-10 relevant subreddits identified for sharing

### Admin & operations
- [ ] Admin dashboard deployed (basic auth)
- [ ] Refund process documented
- [ ] Support email created (support@playbookmint.com)
- [ ] Backup process tested (database + R2)

---

## 16) Week 1-8 roadmap

**Week 1-2: Build + Launch**
- Set up full technical stack
- Write and publish 5 articles + 5 playbooks
- Test all flows end-to-end
- Soft launch: share with personal network

**Week 3-4: Content + Traffic**
- Publish 4 more articles (total: 9)
- Share thoughtfully in 5-10 communities
- Start answering questions on Quora/Reddit with links
- Monitor analytics daily, fix any friction points

**Week 5-6: Optimization**
- A/B test: CTA position (40% vs 60% scroll depth)
- A/B test: Price ($5 vs $7 on one playbook)
- Improve top 3 articles based on bounce rate
- Add exit-intent email popup

**Week 7-8: Scale Content**
- Publish 6 more articles (total: 15)
- Create 2 playbook bundles
- First paid newsletter sponsorship ($50-100)
- Guest post on 1 complementary blog

**Target by end of Week 8:**
- 15 articles published
- 8 playbooks available
- 3,000+ monthly visitors
- 1.5%+ conversion rate
- $300-500 monthly revenue
- 500+ email subscribers

---

## 17) Success criteria (MVP complete)

The MVP is considered successful when:

1. **Traffic:** 5,000+ monthly visitors from organic search
2. **Conversion:** 2%+ article → purchase rate sustained for 2 weeks
3. **Revenue:** $500+ monthly revenue (100+ purchases)
4. **Email:** 500+ newsletter subscribers (12%+ capture rate)
5. **Technical:** 99%+ uptime, < 2.5s LCP, zero critical bugs
6. **Content:** 15+ articles published, 8+ playbooks
7. **Validation:** 3+ unsolicited positive testimonials or reviews

At this point, consider next phase:
- User accounts + "My Library"
- Playbook bundles + subscription tier
- Affiliate program activation
- Hire writer/VA for content scaling

---

## 18) Key risks & mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Low traffic** | No sales | Double down on SEO keywords with actual search volume; paid ads to test conversion; aggressive community engagement |
| **Low conversion** | Poor unit economics | A/B test pricing ($3, $5, $7); improve CTA copy; add social proof; test different playbook formats |
| **High refunds** | Revenue loss + trust issues | Over-deliver on playbook quality; set clear expectations; 7-day refund to filter tire-kickers |
| **Email deliverability** | Lost conversions | Proper domain authentication; plain-text emails; avoid spammy words; monitor bounce rates |
| **Playbook piracy** | Revenue loss | PDF watermarking with order ID; signed links expire; acceptable loss at this scale |
| **Content theft** | SEO issues | Watermark images; canonical tags; DMCA takedowns if needed; focus on making originals better |
| **Burnout** | Slow progress | Batch content creation; use AI for outlines; hire writer at $100/article after validation |

---

## 19) Post-MVP evolution path

**Phase 2 (Month 3-6): Scale & Optimize**
- User accounts with "My Library"
- Playbook bundles (3 for $15)
- Upsells on thank-you page
- Email automation sequences
- 30+ articles, 15+ playbooks

**Phase 3 (Month 6-12): Premium Tiers**
- Subscription: $9/mo for all playbooks
- Weekly member-only content
- Private Discord or Slack
- 1-on-1 office hours (limited slots)
- 50+ articles, 25+ playbooks

**Phase 4 (Year 2): Community & Ecosystem**
- Affiliate program (20% commission)
- Course platform integration
- Paid workshops or webinars
- Community showcase (member wins)
- White-label playbooks for partners

---

## 20) Final thoughts & philosophy

**The model:**
Free content builds trust and traffic. Playbooks are **impulse purchases for the motivated**. Price point ($5-9) is low enough to say "yes" without much deliberation, high enough to feel valuable.

**The moat:**
Your unfair advantage isn't the tech stack—it's the **quality and specificity of content**. Generic advice is free everywhere. Step-by-step systems with templates are rare.

**The execution:**
Launch lean. One perfect funnel is worth more than 50 half-built features. Measure everything. Double down on what works. Cut what doesn't.

**The timeline:**
This can be built in 2 weeks of focused work. Ship fast, iterate faster. Your first playbook won't be perfect—that's fine. Version 2 will be better because you'll have real buyer feedback.

---

**You're building a machine that turns Google traffic into small, happy transactions. Make it simple, make it valuable, make it work.**

Now go build it. 🚀