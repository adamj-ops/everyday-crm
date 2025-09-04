import path from 'node:path';

import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';
import { migrate } from 'drizzle-orm/pglite/migrator';

import * as schema from '../src/models/Schema';
import { documentsSchema } from '../src/models/Schema';

async function insertTestData() {
  console.log('Inserting test document data...');

  // Use the same global pattern as the main DB.ts to share the instance
  const global = globalThis as unknown as { client: PGlite; drizzle: any };

  if (!global.client) {
    global.client = new PGlite();
    await global.client.waitReady;
    global.drizzle = drizzle(global.client, { schema });

    // Run migrations
    await migrate(global.drizzle, {
      migrationsFolder: path.join(process.cwd(), 'migrations'),
    });
  }

  const db = global.drizzle;

  // Insert test documents
  const testDocuments = [
    {
      orgId: 'dev-org-456',
      type: 'disclosure',
      title: 'Sample Disclosure Document.pdf',
      blobUrl: 'https://example.vercel-storage.com/sample-disclosure.pdf',
      blobPath: 'deals/test-deal-123/uuid-123-sample-disclosure.pdf',
      mimeType: 'application/pdf',
      fileSize: 1024000,
      dealId: 'test-deal-123',
    },
    {
      orgId: 'dev-org-456',
      type: 'contract',
      title: 'Purchase Agreement.docx',
      blobUrl: 'https://example.vercel-storage.com/purchase-agreement.docx',
      blobPath: 'deals/test-deal-123/uuid-456-purchase-agreement.docx',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      fileSize: 2048000,
      dealId: 'test-deal-123',
    },
    {
      orgId: 'dev-org-456',
      type: 'disclosure',
      title: 'Property Inspection Report.pdf',
      blobUrl: 'https://example.vercel-storage.com/inspection-report.pdf',
      blobPath: 'deals/test-deal-456/uuid-789-inspection-report.pdf',
      mimeType: 'application/pdf',
      fileSize: 3072000,
      dealId: 'test-deal-456',
    },
  ];

  try {
    const results = await db.insert(documentsSchema).values(testDocuments).returning();

    console.log(`Successfully inserted ${results.length} test documents:`);
    console.table(results.map((doc: any) => ({
      id: doc.id,
      type: doc.type,
      title: doc.title,
      dealId: doc.dealId,
      fileSize: doc.fileSize,
    })));
  } catch (error) {
    console.error('Error inserting test data:', error);
  }

  // Don't close the global client as it might be used by other processes
  console.log('Test data insertion completed.');
}

insertTestData().catch((err) => {
  console.error(err);
  process.exit(1);
});
