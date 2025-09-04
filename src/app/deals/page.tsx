'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';

type Deal = {
  id: string;
  stage: string;
  created_at: string;
  updated_at: string;
  street_1: string;
  city: string;
  state: string;
  postal_code: string;
  property_type: string;
};

const STAGES = [
  { key: 'new', label: 'New' },
  { key: 'under_contract', label: 'Under Contract' },
  { key: 'closing', label: 'Closing' },
  { key: 'closed', label: 'Closed' },
];

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      const response = await fetch('/api/deals/list');
      if (!response.ok) {
        throw new Error('Failed to fetch deals');
      }
      const data = await response.json();
      setDeals(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  async function move(dealId: string, newStage: string) {
    try {
      await fetch('/api/deals/update-stage', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ dealId, newStage }),
      });
      load(); // Refresh the deals list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update deal');
    }
  }

  useEffect(() => {
    load();
  }, []);

  const dealsByStage = STAGES.reduce((acc, stage) => {
    acc[stage.key] = deals.filter(deal => deal.stage === stage.key);
    return acc;
  }, {} as Record<string, Deal[]>);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex h-64 items-center justify-center">
          <div className="text-lg">Loading deals...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="rounded-md border border-red-200 bg-red-50 p-4">
          <h3 className="font-medium text-red-800">Error loading deals</h3>
          <p className="mt-1 text-red-600">{error}</p>
          <Button onClick={load} className="mt-3" variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Deals Pipeline</h1>
        <Button onClick={load} variant="outline">
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {STAGES.map(stage => (
          <div key={stage.key} className="rounded-lg bg-gray-50 p-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{stage.label}</h2>
              <span className="rounded-full bg-gray-200 px-2 py-1 text-sm text-gray-700">
                {dealsByStage[stage.key]?.length || 0}
              </span>
            </div>

            <div className="space-y-3">
              {dealsByStage[stage.key]?.map(deal => (
                <div
                  key={deal.id}
                  className="rounded-md border bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="mb-2 text-sm font-medium">
                    {deal.street_1}
                  </div>
                  <div className="mb-3 text-xs text-gray-600">
                    {deal.city}
                    ,
                    {deal.state}
                    {' '}
                    {deal.postal_code}
                  </div>
                  <div className="mb-3 text-xs text-gray-500">
                    Type:
                    {' '}
                    {deal.property_type}
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {STAGES.filter(s => s.key !== deal.stage).map(targetStage => (
                      <Button
                        key={targetStage.key}
                        size="sm"
                        variant="outline"
                        onClick={() => move(deal.id, targetStage.key)}
                        className="h-auto px-2 py-1 text-xs"
                      >
                        Move to
                        {' '}
                        {targetStage.label}
                      </Button>
                    ))}
                  </div>

                  <div className="mt-2 text-xs text-gray-400">
                    Created:
                    {' '}
                    {new Date(deal.created_at).toLocaleDateString()}
                  </div>
                </div>
              )) || (
                <div className="py-8 text-center text-sm text-gray-500">
                  No deals in this stage
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {deals.length === 0 && (
        <div className="py-12 text-center">
          <div className="mb-4 text-lg text-gray-500">No deals found</div>
          <p className="text-gray-400">
            Create some deals in your database to see them here.
          </p>
        </div>
      )}
    </div>
  );
}
