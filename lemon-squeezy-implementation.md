# Lemon Squeezy Implementation Plan - The Thrifty Pigeon

## 📋 **PROJECT OVERVIEW**

**Goal (G3 from PRD):** Sell playbooks at $5-$9 via Lemon Squeezy with instant fulfillment via email.

**Current State:** 
- ✅ Mock checkout URLs in place (`https://lemonsqueezy.com/demo-checkout`)
- ✅ CTA components ready for integration
- ✅ Playbook data structure defined
- ❌ No live Lemon Squeezy integration
- ❌ No webhook handling
- ❌ No email fulfillment system

**Target State:**
- Live Lemon Squeezy products and variants
- Dynamic checkout URL generation
- Secure webhook processing
- Automated email fulfillment with download links
- Order tracking and customer management

---

## 🔍 **RESEARCH FINDINGS**

### **Lemon Squeezy Integration Options**

**Option 1: Direct Checkout URLs** (Simplest - Current Approach)
- Static links to pre-configured Lemon Squeezy products
- Format: `https://[store].lemonsqueezy.com/checkout/buy/[product-id]`
- ✅ Fastest to implement
- ❌ Less customization
- ❌ No dynamic pricing/customer data

**Option 2: Checkout API + Overlay** (Recommended)
- Dynamic checkout creation via API
- Embedded overlay checkout experience
- ✅ Full customization
- ✅ Better UX (no page redirect)
- ✅ Customer data capture
- ✅ Dynamic pricing/discounts

**Option 3: Full Billing Portal** (Overkill for MVP)
- Complete customer portal with order history
- Account management, subscription handling
- ❌ Too complex for $5-$9 one-time purchases

### **Key Technical Requirements**

1. **Lemon Squeezy Store Setup**
   - Create store in Lemon Squeezy dashboard
   - Configure products for each playbook
   - Generate API keys
   - Set up webhook endpoints

2. **Next.js API Integration**
   - Webhook handler for order events
   - Checkout URL generation API
   - Email fulfillment system
   - Database for order tracking

3. **Security Considerations**
   - Webhook signature verification (SHA256 HMAC)
   - API key management
   - Rate limiting on webhooks
   - Secure download link generation

4. **Email Fulfillment Flow**
   - Order created → Webhook received → Customer email + download link
   - Download link security (time-based expiration, order verification)
   - Support for re-sending download links

---

## 🎯 **IMPLEMENTATION STRATEGY**

### **Phase 1: Basic Integration (MVP)**
- [ ] Set up Lemon Squeezy store and products
- [ ] Replace mock URLs with real checkout links
- [ ] Implement basic webhook handler
- [ ] Create simple email fulfillment
- [ ] Test end-to-end flow

### **Phase 2: Enhanced Experience**
- [ ] Dynamic checkout URL generation
- [ ] Overlay checkout integration
- [ ] Customer database tracking
- [ ] Secure download link system
- [ ] Email template improvements

### **Phase 3: Advanced Features**
- [ ] Analytics integration (PostHog tracking)
- [ ] Customer support tools
- [ ] Discount/coupon system
- [ ] Email sequences and follow-ups

---

## 📁 **FILE STRUCTURE PLAN**

```
src/
├── app/
│   ├── api/
│   │   ├── webhooks/
│   │   │   └── lemon-squeezy/
│   │   │       └── route.ts        # Webhook handler
│   │   ├── checkout/
│   │   │   └── route.ts            # Dynamic checkout creation
│   │   └── download/
│   │       └── [token]/
│   │           └── route.ts        # Secure download endpoint
│   └── thank-you/
│       └── page.tsx               # Post-purchase page
├── lib/
│   ├── lemon-squeezy.ts           # LS API client
│   ├── email.ts                   # Email sending utilities
│   ├── database.ts                # Order tracking
│   └── downloads.ts               # Download link management
└── types/
    └── lemon-squeezy.ts           # TypeScript definitions
```

---

## ✅ **IMPLEMENTATION CHECKLIST**

### **Pre-Implementation Setup**
- [ ] Create Lemon Squeezy account
- [ ] Set up store in Lemon Squeezy dashboard
- [ ] Enable test mode for development
- [ ] Generate API keys
- [ ] Create products for each playbook (Emergency Fund, Budget Starter, etc.)

### **Environment Configuration**
- [ ] Add environment variables to `.env.local`
  - [ ] `LEMONSQUEEZY_API_KEY`
  - [ ] `LEMONSQUEEZY_WEBHOOK_SECRET`
  - [ ] `LEMONSQUEEZY_STORE_ID`
- [ ] Add environment variables to production (Vercel)

### **Phase 1: Basic Webhook Implementation**
- [ ] Install dependencies (`crypto` for signature verification)
- [ ] Create webhook API route (`/api/webhooks/lemon-squeezy/route.ts`)
- [ ] Implement signature verification
- [ ] Handle `order_created` event
- [ ] Basic email sending (console.log for testing)
- [ ] Test webhook with ngrok locally
- [ ] Deploy webhook endpoint to production
- [ ] Configure webhook URL in Lemon Squeezy dashboard

### **Phase 1: Update Checkout URLs**
- [ ] Replace mock URLs in `playbooks.ts` with real product URLs
- [ ] Test checkout flow end-to-end
- [ ] Verify webhook triggers on purchase
- [ ] Verify email sending works

### **Phase 2: Enhanced Integration**
- [ ] Create dynamic checkout API (`/api/checkout/route.ts`)
- [ ] Install Lemon Squeezy SDK (`@lemonsqueezy/lemonsqueezy.js`)
- [ ] Implement checkout overlay (Lemon.js)
- [ ] Update CTA components to use overlay
- [ ] Create customer database schema
- [ ] Track orders in database
- [ ] Implement secure download links
- [ ] Create thank-you page

### **Phase 2: Email System**
- [ ] Set up email service (Resend or similar)
- [ ] Create email templates for fulfillment
- [ ] Implement download link generation
- [ ] Add customer support email templates
- [ ] Test email delivery across providers

### **Phase 3: Advanced Features**
- [ ] Integrate PostHog event tracking
- [ ] Add customer lookup functionality
- [ ] Implement discount codes
- [ ] Create order management dashboard
- [ ] Add email sequences for customers
- [ ] Performance optimization and monitoring

---

## 🔧 **TECHNICAL IMPLEMENTATION DETAILS**

### **Webhook Handler Structure**
```typescript
// /api/webhooks/lemon-squeezy/route.ts
export async function POST(request: NextRequest) {
  // 1. Verify webhook signature
  // 2. Parse event data
  // 3. Handle different event types (order_created, subscription_updated, etc.)
  // 4. Send fulfillment email
  // 5. Update database records
  // 6. Return 200 OK
}
```

### **Database Schema (Minimal)**
```sql
-- Orders table
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  lemon_squeezy_order_id VARCHAR(255) UNIQUE NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  playbook_sku VARCHAR(100) NOT NULL,
  amount_cents INTEGER NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(50) NOT NULL,
  download_token VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Download tracking
CREATE TABLE downloads (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  downloaded_at TIMESTAMP DEFAULT NOW(),
  ip_address VARCHAR(45),
  user_agent TEXT
);
```

### **Security Considerations**
- Webhook signature verification using HMAC SHA256
- Rate limiting on webhook endpoints
- Secure token generation for download links
- IP-based download tracking (optional)
- Time-based link expiration (30 days recommended)

---

## 🚀 **DEPLOYMENT PLAN**

### **Development Phase**
1. **Local Development**
   - Use ngrok for webhook testing
   - Test mode enabled in Lemon Squeezy
   - Console logging for debugging

2. **Staging Deployment**
   - Deploy to Vercel preview branch
   - Test with real Lemon Squeezy webhooks
   - Verify email delivery
   - Test full purchase flow

3. **Production Launch**
   - Disable test mode in Lemon Squeezy
   - Update webhook URLs to production
   - Monitor error rates and performance
   - Set up alerting for failed webhooks

### **Testing Checklist**
- [ ] Successful purchase flow (test card)
- [ ] Webhook receives and processes events
- [ ] Customer receives email with download link
- [ ] Download link works and is secure
- [ ] Failed payments handled gracefully
- [ ] Duplicate webhook events handled (idempotency)
- [ ] Invalid webhook signatures rejected
- [ ] Email delivery across different providers

---

## 📊 **SUCCESS METRICS**

### **Technical Metrics**
- Webhook success rate (target: >99.5%)
- Email delivery rate (target: >98%)
- Download link success rate (target: >99%)
- API response times (target: <500ms)

### **Business Metrics (from PRD)**
- Article → Purchase conversion rate (target: ≥1.5%)
- Purchase completion rate (target: ≥85%)
- Customer satisfaction (low refund rate: ≤5%)
- Monthly revenue growth

### **Monitoring & Alerts**
- Failed webhook processing
- Email delivery failures
- High error rates on checkout API
- Unusual download patterns
- Customer support requests

---

## 🛠️ **NEXT STEPS**

1. **Immediate (This Session)**
   - Create Lemon Squeezy account and store
   - Set up basic products
   - Implement Phase 1 webhook handler

2. **Short-term (Next 2-3 Days)**
   - Complete Phase 1 implementation
   - Test end-to-end flow
   - Deploy to production

3. **Medium-term (Next Week)**
   - Implement Phase 2 enhancements
   - Add analytics tracking
   - Optimize email templates

4. **Long-term (Next Month)**
   - Phase 3 advanced features
   - Customer feedback integration
   - Performance optimization

---

## 💡 **KEY DECISIONS MADE**

1. **Approach**: Start with basic integration (Phase 1), enhance iteratively
2. **Checkout Method**: Begin with direct URLs, upgrade to overlay in Phase 2
3. **Database**: Simple schema focused on orders and downloads
4. **Email**: Transactional email service (Resend recommended)
5. **Security**: Standard webhook verification + time-based download tokens
6. **Testing**: Test mode first, comprehensive testing before production launch

**Ready to begin implementation!** 🚀