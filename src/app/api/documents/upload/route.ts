import { randomUUID } from 'node:crypto';

import { put } from '@vercel/blob';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { getCurrentAuth, withRls } from '@/server/db';

export async function POST(req: NextRequest) {
  try {
    const { userId, orgId } = await getCurrentAuth();
    const form = await req.formData();
    const file = form.get('file') as File;
    const dealId = form.get('dealId') as string;

    if (!file || !dealId) {
      return NextResponse.json({ error: 'Missing file or dealId' }, { status: 400 });
    }

    const key = `deals/${dealId}/${randomUUID()}-${file.name}`; // <- blob_path
    const { url } = await put(key, file, { access: 'public' }); // <- blob_url

    // persist in DB using raw SQL
    const row = await withRls(userId, orgId, async (client) => {
      const result = await client.query(
        `INSERT INTO documents (org_id, type, title, blob_url, blob_path, mime_type, file_size, deal_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [
          orgId,
          'disclosure', // send actual document_type from your form
          file.name,
          url,
          key,
          file.type || null,
          file.size || null,
          dealId,
        ],
      );
      return result.rows[0];
    });

    return NextResponse.json(row);
  } catch (error) {
    console.error('Document upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
