/**
 * Helper to extract safe, actionable diagnostic database error messages
 * without ever exposing database passwords, hostnames, or private credentials.
 */
export function formatDatabaseError(err: any): { userMessage: string; statusCode: number; code?: string } {
  const code = err?.code;
  const rawMessage = String(err?.message || '');

  // P1000: Authentication failed
  if (code === 'P1000' || rawMessage.includes('Authentication failed') || rawMessage.includes('password authentication failed')) {
    return {
      userMessage: 'Database authentication failed (P1000): The database username or password in DATABASE_URL is invalid.',
      statusCode: 401,
      code: 'P1000',
    };
  }

  // P1001: Cannot reach database server
  if (code === 'P1001' || rawMessage.includes("Can't reach database server") || rawMessage.includes('ECONNREFUSED') || rawMessage.includes('ENOTFOUND')) {
    return {
      userMessage: "Cannot reach database server (P1001): Please verify that your PostgreSQL host is online, accessible from Vercel, and accepting connections.",
      statusCode: 503,
      code: 'P1001',
    };
  }

  // P1002 / P1008: Database timeout
  if (code === 'P1002' || code === 'P1008' || rawMessage.includes('timed out') || rawMessage.includes('Connection terminated')) {
    return {
      userMessage: 'Database connection timed out (P1002): The cloud database is taking too long to respond. For Neon/Supabase, use a pooled connection string with ?pgbouncer=true.',
      statusCode: 504,
      code: 'P1002',
    };
  }

  // P1003: Database does not exist
  if (code === 'P1003' || rawMessage.includes('database') && rawMessage.includes('does not exist')) {
    return {
      userMessage: 'Database does not exist (P1003): The database name specified in your DATABASE_URL does not exist on your PostgreSQL server.',
      statusCode: 404,
      code: 'P1003',
    };
  }

  // P1013: Invalid connection string
  if (code === 'P1013' || rawMessage.includes('invalid') && rawMessage.includes('connection string')) {
    return {
      userMessage: 'Invalid DATABASE_URL format (P1013): Please ensure the URL begins with postgresql:// or postgres:// and is properly URL-encoded.',
      statusCode: 400,
      code: 'P1013',
    };
  }

  // P2021: Table does not exist (Schema uninitialized)
  if (code === 'P2021' || rawMessage.includes('does not exist') || rawMessage.includes('relation') || rawMessage.includes('Table')) {
    return {
      userMessage: "Database tables are not created (P2021): The PostgreSQL database is reachable, but the schema has not been pushed yet. Please run 'npx prisma db push' and 'npm run prisma:seed'.",
      statusCode: 500,
      code: 'P2021',
    };
  }

  // SSL Certificate issues
  if (rawMessage.includes('SSL') || rawMessage.includes('certificate') || rawMessage.includes('tls')) {
    return {
      userMessage: "Database SSL error: Cloud PostgreSQL requires SSL mode. Please append '?sslmode=require' to your DATABASE_URL in Vercel.",
      statusCode: 500,
      code: 'SSL_ERROR',
    };
  }

  // Generic sanitized fallback
  const firstLine = rawMessage.split('\n')[0].replace(/postgresql:\/\/[^@]+@/g, 'postgresql://***:***@');
  return {
    userMessage: `Database error${code ? ` (${code})` : ''}: ${firstLine || 'Failed to complete database operation. Check server logs.'}`,
    statusCode: 500,
    code,
  };
}
