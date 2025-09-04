import path from 'node:path';

import { PGlite } from '@electric-sql/pglite';
import { drizzle as drizzlePglite } from 'drizzle-orm/pglite';
import { migrate as migratePglite } from 'drizzle-orm/pglite/migrator';
import { Pool } from 'pg';

import * as schema from '../src/models/Schema';

async function run() {
  // Check if we have a DATABASE_URL (PostgreSQL) or use PGlite
  if (process.env.DATABASE_URL) {
    console.log('Using PostgreSQL connection...');
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });

    const res = await pool.query(`
      select id, type, title, blob_url, created_at
      from documents
      order by created_at desc
      limit 10
    `);
    console.table(res.rows);
    await pool.end();
  } else {
    console.log('Using PGlite (local database)...');

    // Use the same global pattern as the main DB.ts to share the instance
    const global = globalThis as unknown as { client: PGlite; drizzle: any };

    if (!global.client) {
      global.client = new PGlite();
      await global.client.waitReady;
      global.drizzle = drizzlePglite(global.client, { schema });

      // Run migrations
      await migratePglite(global.drizzle, {
        migrationsFolder: path.join(process.cwd(), 'migrations'),
      });
    }

    const client = global.client;

    try {
      // First check if documents table exists and has data
      const countResult = await client.query(`SELECT COUNT(*) as count FROM documents`);
      console.log(`Documents table has ${(countResult.rows[0] as any).count} records`);

      const result = await client.query(`
        select id, type, title, blob_url, created_at
        from documents
        order by created_at desc
        limit 10
      `);

      console.log('Documents found:');
      if (result.rows.length === 0) {
        console.log('No documents in the table.');
      } else {
        console.table(result.rows);
      }
    } catch (error) {
      console.log('Error querying documents table:', (error as Error).message);
      console.log('Let\'s check available tables:');

      // Check what tables exist
      const tables = await client.query(`
        SELECT tablename as name FROM pg_tables 
        WHERE schemaname = 'public'
        ORDER BY tablename
      `);

      console.log('Available tables:');
      console.table(tables.rows);
    }

    // Don't close the global client as it might be used by other processes
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
