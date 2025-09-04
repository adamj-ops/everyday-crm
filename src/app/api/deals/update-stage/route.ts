import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { devOrgId, devUserId, withRls } from '@/server/db';

const UpdateStageBody = z.object({
  dealId: z.string().uuid(),
  newStage: z.enum(['new', 'under_contract', 'closing', 'closed']),
});

export async function POST(req: NextRequest) {
  try {
    const body = UpdateStageBody.parse(await req.json());

    const updatedDeal = await withRls(devUserId, devOrgId, async (client) => {
      const result = await client.query(
        `UPDATE deals 
         SET stage = $1, updated_at = CURRENT_TIMESTAMP
         WHERE id = $2 AND org_id = $3
         RETURNING *`,
        [body.newStage, body.dealId, devOrgId],
      );

      if (!result.rowCount) {
        throw new Error('Deal not found or access denied');
      }

      return result.rows[0];
    });

    return NextResponse.json(updatedDeal);
  } catch (error) {
    console.error('Error updating deal stage:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 },
      );
    }

    if ((error as Error).message === 'Deal not found or access denied') {
      return NextResponse.json(
        { error: (error as Error).message },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
