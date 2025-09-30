import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db/client';
import { newsletterSubscribers, signupSources } from '@/db/schema';
import { eq, or } from 'drizzle-orm';
import { sendWelcomeEmail } from '@/lib/email/email-service';

// Newsletter signup validation schema
const newsletterSignupSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  firstName: z.string().optional(),
  source: z.enum(['website', 'popup', 'purchase', 'manual', 'import']).default('website'),
  referrer: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  gdprConsent: z.boolean().default(true),
  emailPreferences: z.object({
    newsletter: z.boolean().default(true),
    marketing: z.boolean().default(false),
    productUpdates: z.boolean().default(true),
  }).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = newsletterSignupSchema.parse(body);
    
    const {
      email,
      firstName,
      source,
      referrer,
      utmSource,
      utmMedium,
      utmCampaign,
      gdprConsent,
      emailPreferences
    } = validatedData;

    // Clean and normalize email
    const normalizedEmail = email.toLowerCase().trim();
    
    // Extract first name from email if not provided
    const finalFirstName = firstName || normalizedEmail.split('@')[0];

    // Get client IP and User Agent for analytics
    const clientIp = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    console.log(`📧 Newsletter signup attempt: ${normalizedEmail} from ${source}`);

    // Check if subscriber already exists
    const existingSubscriber = await db
      .select()
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.email, normalizedEmail))
      .limit(1);

    if (existingSubscriber.length > 0) {
      const subscriber = existingSubscriber[0];
      
      // If already subscribed and active, return success with existing data
      if (subscriber.status === 'active') {
        console.log(`✅ User already subscribed: ${normalizedEmail}`);
        return NextResponse.json({
          success: true,
          message: 'You\'re already subscribed to our newsletter!',
          alreadySubscribed: true,
          subscriber: {
            email: subscriber.email,
            firstName: subscriber.firstName,
            createdAt: subscriber.createdAt
          }
        });
      }
      
      // If previously unsubscribed, reactivate
      if (subscriber.status === 'unsubscribed') {
        console.log(`🔄 Reactivating unsubscribed user: ${normalizedEmail}`);
        
        const reactivatedSubscriber = await db
          .update(newsletterSubscribers)
          .set({
            status: 'active',
            firstName: finalFirstName,
            source,
            signupIp: clientIp,
            signupUserAgent: userAgent,
            gdprConsent,
            emailPreferences: emailPreferences || {
              newsletter: true,
              marketing: false,
              productUpdates: true,
            },
            unsubscribedAt: null,
            unsubscribeReason: null,
            updatedAt: new Date(),
          })
          .where(eq(newsletterSubscribers.email, normalizedEmail))
          .returning();

        // Send welcome email for reactivated subscriber
        const emailResult = await sendWelcomeEmail({
          email: normalizedEmail,
          firstName: finalFirstName
        });

        if (!emailResult.success) {
          console.warn(`⚠️  Welcome email failed for reactivated subscriber: ${emailResult.error}`);
        }

        // Track signup source
        await trackSignupSource(source, referrer, utmSource, utmMedium, utmCampaign);

        return NextResponse.json({
          success: true,
          message: 'Welcome back! You\'ve been resubscribed to our newsletter.',
          reactivated: true,
          subscriber: reactivatedSubscriber[0],
          emailSent: emailResult.success
        });
      }
    }

    // Create new subscriber
    console.log(`➕ Creating new subscriber: ${normalizedEmail}`);
    
    const newSubscriber = await db
      .insert(newsletterSubscribers)
      .values({
        email: normalizedEmail,
        firstName: finalFirstName,
        status: 'active', // Assume single opt-in for now
        source,
        signupIp: clientIp,
        signupUserAgent: userAgent,
        gdprConsent,
        emailPreferences: emailPreferences || {
          newsletter: true,
          marketing: false,
          productUpdates: true,
        },
        tags: ['new_subscriber'],
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    console.log(`✅ New subscriber created: ${newSubscriber[0].id}`);

    // Send welcome email
    const emailResult = await sendWelcomeEmail({
      email: normalizedEmail,
      firstName: finalFirstName
    });

    if (!emailResult.success) {
      console.error(`❌ Welcome email failed: ${emailResult.error}`);
      // Don't fail the whole signup if email fails
    } else {
      console.log(`📬 Welcome email sent: ${emailResult.id}`);
      
      // Update email stats
      await db
        .update(newsletterSubscribers)
        .set({
          totalEmailsSent: 1,
          lastEmailSentAt: new Date(),
        })
        .where(eq(newsletterSubscribers.email, normalizedEmail));
    }

    // Track signup source for analytics
    await trackSignupSource(source, referrer, utmSource, utmMedium, utmCampaign);

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to the newsletter! Check your email for a welcome message.',
      subscriber: {
        id: newSubscriber[0].id,
        email: newSubscriber[0].email,
        firstName: newSubscriber[0].firstName,
        createdAt: newSubscriber[0].createdAt
      },
      emailSent: emailResult.success
    });

  } catch (error) {
    console.error('Newsletter signup error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid signup data',
          errors: error.issues.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to subscribe to newsletter. Please try again.',
        error: process.env.NODE_ENV === 'development' 
          ? error instanceof Error ? error.message : 'Unknown error'
          : 'Internal server error'
      },
      { status: 500 }
    );
  }
}

// Helper function to track signup sources for analytics
async function trackSignupSource(
  source: string,
  referrer?: string,
  utmSource?: string,
  utmMedium?: string,
  utmCampaign?: string
) {
  try {
    // Check if this source combination already exists
    const existingSource = await db
      .select()
      .from(signupSources)
      .where(
        or(
          eq(signupSources.sourceName, source),
          eq(signupSources.utmSource, utmSource || ''),
        )
      )
      .limit(1);

    if (existingSource.length > 0) {
      // Update existing source count
      await db
        .update(signupSources)
        .set({
          signupCount: existingSource[0].signupCount + 1,
        })
        .where(eq(signupSources.id, existingSource[0].id));
    } else {
      // Create new source tracking entry
      await db.insert(signupSources).values({
        sourceName: source,
        referrer,
        utmSource,
        utmMedium,
        utmCampaign,
        signupCount: 1,
      });
    }
  } catch (error) {
    console.warn('Failed to track signup source:', error);
    // Don't fail the main signup if tracking fails
  }
}

// GET endpoint for testing and health check
export async function GET() {
  try {
    const totalSubscribers = await db.select().from(newsletterSubscribers);
    const activeSubscribers = totalSubscribers.filter(sub => sub.status === 'active');
    
    return NextResponse.json({
      message: 'Newsletter signup endpoint is working',
      stats: {
        totalSubscribers: totalSubscribers.length,
        activeSubscribers: activeSubscribers.length,
        pendingSubscribers: totalSubscribers.filter(sub => sub.status === 'pending').length,
        unsubscribed: totalSubscribers.filter(sub => sub.status === 'unsubscribed').length,
      },
      endpoints: {
        subscribe: 'POST /api/newsletter/subscribe',
        unsubscribe: 'POST /api/newsletter/unsubscribe (coming soon)',
        preferences: 'GET/POST /api/newsletter/preferences (coming soon)'
      }
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: 'Newsletter endpoint error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}