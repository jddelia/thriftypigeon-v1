import { NextResponse } from 'next/server';
import { db, checkDatabaseHealth } from '@/db/client';
import { newsletterSubscribers } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    // Test database health
    const healthCheck = await checkDatabaseHealth();
    
    if (!healthCheck.healthy) {
      return NextResponse.json({
        success: false,
        message: 'Database health check failed',
        details: healthCheck
      }, { status: 500 });
    }
    
    // Test basic query
    const subscriberCount = await db.select().from(newsletterSubscribers);
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      details: {
        healthCheck,
        subscriberCount: subscriberCount.length,
        tables: [
          'newsletter_subscribers',
          'email_campaigns',
          'email_deliveries',
          'email_templates',
          'signup_sources',
          'newsletter_issues'
        ]
      }
    });
    
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json({
      success: false,
      message: 'Database test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST() {
  try {
    // Test CRUD operations
    console.log('Testing database CRUD operations...');
    
    // Insert test subscriber
    const testEmail = `test-${Date.now()}@example.com`;
    const insertResult = await db.insert(newsletterSubscribers).values({
      email: testEmail,
      firstName: 'Test User',
      status: 'active',
      source: 'website',
      gdprConsent: true,
      emailPreferences: {
        newsletter: true,
        marketing: false,
        productUpdates: true,
      },
      tags: ['test', 'crud-test'],
    }).returning();
    
    console.log('Inserted test subscriber:', insertResult[0]);
    
    // Query the inserted subscriber
    const queryResult = await db
      .select()
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.email, testEmail));
    
    console.log('Queried subscriber:', queryResult[0]);
    
    // Update the subscriber
    const updateResult = await db
      .update(newsletterSubscribers)
      .set({ 
        firstName: 'Updated Test User',
        totalEmailsSent: 1 
      })
      .where(eq(newsletterSubscribers.email, testEmail))
      .returning();
    
    console.log('Updated subscriber:', updateResult[0]);
    
    // Clean up - delete test subscriber
    await db.delete(newsletterSubscribers)
      .where(eq(newsletterSubscribers.email, testEmail));
    
    console.log('Cleaned up test data');
    
    return NextResponse.json({
      success: true,
      message: 'Database CRUD operations successful',
      operations: {
        insert: insertResult[0],
        query: queryResult[0],
        update: updateResult[0],
        delete: 'completed'
      }
    });
    
  } catch (error) {
    console.error('Database CRUD test error:', error);
    return NextResponse.json({
      success: false,
      message: 'Database CRUD test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}