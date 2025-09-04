import { Pool } from 'pg';

import { Env } from '@/libs/Env';

// Development constants - get from environment variables
export const devUserId = process.env.DEV_USER_ID || 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
export const devOrgId = process.env.DEV_ORG_ID || '11111111-1111-1111-1111-111111111111';

// Create a connection pool for PostgreSQL
let pool: Pool | null = null;

function getPool(): Pool {
  if (!pool) {
    if (!Env.DATABASE_URL) {
      throw new Error('DATABASE_URL is required for PostgreSQL operations');
    }
    pool = new Pool({
      connectionString: Env.DATABASE_URL,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  }
  return pool;
}

/**
 * Row Level Security (RLS) wrapper for multi-tenant database operations
 * This function provides a PostgreSQL client with proper RLS context
 */
export async function withRls<T>(
  userId: string,
  orgId: string,
  callback: (client: {
    query: (sql: string, params?: any[]) => Promise<{ rows: any[]; rowCount: number | null }>;
  }) => Promise<T>,
): Promise<T> {
  const pool = getPool();
  const client = await pool.connect();

  try {
    // Begin transaction
    await client.query('BEGIN');

    // Set RLS context variables for this session
    await client.query('SET LOCAL app.current_user_id = $1', [userId]);
    await client.query('SET LOCAL app.current_org_id = $1', [orgId]);

    // Execute the callback with the configured client
    const result = await callback({
      query: async (sql: string, params?: any[]) => {
        const result = await client.query(sql, params);
        return {
          rows: result.rows,
          rowCount: result.rowCount,
        };
      },
    });

    // Commit transaction
    await client.query('COMMIT');
    return result;
  } catch (error) {
    // Rollback transaction on error
    await client.query('ROLLBACK');
    throw error;
  } finally {
    // Release the client back to the pool
    client.release();
  }
}
