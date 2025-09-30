import { db, checkDatabaseHealth } from './client';
import { newsletterSubscribers } from './schema';

// Simple test function to verify database connection and basic operations
export async function testDatabaseConnection() {
  console.log('🧪 Testing database connection...');
  
  try {
    // Test database health
    const healthCheck = await checkDatabaseHealth();
    console.log('Health check:', healthCheck);
    
    if (!healthCheck.healthy) {
      throw new Error('Database health check failed');
    }
    
    // Test table count (should be 0 initially)
    const subscriberCount = await db.select().from(newsletterSubscribers).then(rows => rows.length);
    console.log(`📊 Current subscriber count: ${subscriberCount}`);
    
    // Test inserting a sample subscriber
    console.log('📝 Testing insert operation...');
    const testSubscriber = await db.insert(newsletterSubscribers).values({
      email: 'test@example.com',
      firstName: 'Test',
      status: 'active',
      source: 'website',
      gdprConsent: true,
      emailPreferences: {
        newsletter: true,
        marketing: false,
        productUpdates: true,
      },
      tags: ['test', 'initial'],
    }).returning();
    
    console.log('✅ Inserted test subscriber:', testSubscriber[0]);
    
    // Test querying
    console.log('🔍 Testing query operation...');
    const allSubscribers = await db.select().from(newsletterSubscribers);
    console.log(`📋 Total subscribers after insert: ${allSubscribers.length}`);
    console.log('👤 Sample subscriber data:', allSubscribers[0]);
    
    // Test updating
    console.log('✏️  Testing update operation...');
    const updatedSubscriber = await db
      .update(newsletterSubscribers)
      .set({ 
        firstName: 'Updated Test User',
        totalEmailsSent: 1 
      })
      .where(eq(newsletterSubscribers.email, 'test@example.com'))
      .returning();
    
    console.log('📝 Updated subscriber:', updatedSubscriber[0]);
    
    // Clean up - delete test subscriber
    console.log('🧹 Cleaning up test data...');
    await db.delete(newsletterSubscribers).where(eq(newsletterSubscribers.email, 'test@example.com'));
    
    const finalCount = await db.select().from(newsletterSubscribers).then(rows => rows.length);
    console.log(`📊 Final subscriber count: ${finalCount}`);
    
    console.log('🎉 All database tests passed successfully!');
    return { success: true, message: 'Database connection and operations working correctly' };
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
    return { 
      success: false, 
      message: 'Database test failed', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Helper function to import eq operator
import { eq } from 'drizzle-orm';

// Export for use in other files
export { testDatabaseConnection as default };