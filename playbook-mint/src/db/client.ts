import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

// Environment variables for database connection
const databaseUrl = process.env.DATABASE_URL;
const databaseAuthToken = process.env.DATABASE_AUTH_TOKEN;

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is required');
}

// Create database client based on environment
let client;

if (databaseUrl.startsWith('file:') || databaseUrl.startsWith('./') || databaseUrl.endsWith('.db')) {
  // Local SQLite database for development
  client = createClient({
    url: databaseUrl,
  });
} else if (databaseUrl.startsWith('libsql://')) {
  // Turso database for production
  if (!databaseAuthToken) {
    throw new Error('DATABASE_AUTH_TOKEN is required for Turso databases');
  }
  
  client = createClient({
    url: databaseUrl,
    authToken: databaseAuthToken,
  });
} else {
  // Generic libSQL client
  client = createClient({
    url: databaseUrl,
    authToken: databaseAuthToken,
  });
}

// Create Drizzle instance with schema
export const db = drizzle(client, { schema });

// Export types and client for advanced usage
export { client };
export * from './schema';

// Database health check utility
export async function checkDatabaseHealth(): Promise<{
  healthy: boolean;
  message: string;
  details?: any;
}> {
  try {
    // Try a simple query to verify connection
    const result = await client.execute('SELECT 1 as health_check');
    
    if (result.rows.length > 0) {
      return {
        healthy: true,
        message: 'Database connection is healthy',
        details: {
          databaseType: databaseUrl?.startsWith('libsql://') ? 'Turso' : 'Local SQLite',
          url: databaseUrl?.replace(/\/\/.*@/, '//***@'), // Hide credentials
        }
      };
    } else {
      return {
        healthy: false,
        message: 'Database query returned no results',
      };
    }
  } catch (error) {
    return {
      healthy: false,
      message: 'Database connection failed',
      details: {
        error: error instanceof Error ? error.message : 'Unknown error',
        databaseUrl: databaseUrl?.replace(/\/\/.*@/, '//***@'), // Hide credentials
      }
    };
  }
}

// Utility function to close database connection (mainly for testing)
export async function closeDatabaseConnection(): Promise<void> {
  try {
    await client.close();
  } catch (error) {
    console.warn('Error closing database connection:', error);
  }
}