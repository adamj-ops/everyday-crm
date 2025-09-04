import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { devOrgId, devUserId, withRls } from '@/server/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const stage = searchParams.get('stage');

    const deals = await withRls(devUserId, devOrgId, async (client) => {
      let query = `
        SELECT 
          d.id,
          d.stage,
          d.created_at,
          d.updated_at,
          p.street_1,
          p.city,
          p.state,
          p.postal_code,
          p.type as property_type
        FROM deals d
        JOIN properties p ON d.property_id = p.id
        WHERE d.org_id = $1
      `;

      const params = [devOrgId];

      if (stage) {
        query += ` AND d.stage = $2`;
        params.push(stage);
      }

      query += ` ORDER BY d.created_at DESC`;

      const result = await client.query(query, params);
      return result.rows;
    });

    return NextResponse.json(deals);
  } catch (error) {
    console.error('Error fetching deals:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
