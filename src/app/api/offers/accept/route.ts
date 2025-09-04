import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { getCurrentAuth, withRls } from '@/server/db';

const AcceptOfferBody = z.object({
  offerId: z.string().uuid(),
  assignmentFee: z.number().nonnegative(),
});

export async function POST(req: NextRequest) {
  try {
    const { userId, orgId } = await getCurrentAuth();
    const body = AcceptOfferBody.parse(await req.json());

    const assignment = await withRls(userId, orgId, async (client) => {
      // First, update the offer status to 'accepted'
      const accepted = await client.query(
        'UPDATE offers SET status = \'accepted\' WHERE id = $1 AND EXISTS (SELECT 1 FROM deals WHERE deals.id = offers.deal_id AND deals.org_id = $2) RETURNING deal_id, buyer_contact_id',
        [body.offerId, orgId],
      );

      if (!accepted.rowCount) {
        throw new Error('Offer not found or access denied');
      }

      const { deal_id, buyer_contact_id } = accepted.rows[0];

      // Then, upsert the assignment
      const upsert = await client.query(
        `INSERT INTO assignments (deal_id, buyer_contact_id, assignment_fee, assignment_date)
         VALUES ($1, $2, $3, CURRENT_DATE)
         ON CONFLICT (deal_id) DO UPDATE
           SET buyer_contact_id = EXCLUDED.buyer_contact_id,
               assignment_fee   = EXCLUDED.assignment_fee,
               assignment_date  = EXCLUDED.assignment_date
         RETURNING *`,
        [deal_id, buyer_contact_id, body.assignmentFee],
      );

      return upsert.rows[0];
    });

    return NextResponse.json(assignment);
  } catch (error) {
    console.error('Error accepting offer:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 },
      );
    }

    if ((error as Error).message === 'Offer not found or access denied') {
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
