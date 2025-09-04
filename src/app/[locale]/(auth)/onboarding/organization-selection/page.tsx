'use client';

import { useAuth } from '@clerk/nextjs';

const OrganizationSelectionPage = () => {
  const { isLoaded, userId, orgId } = useAuth();

  // Simple test - just show auth state
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="text-center">
        <h1 className="mb-6 text-2xl font-bold">Organization Selection Test</h1>
        <div className="space-y-2">
          <p>
            isLoaded:
            {isLoaded ? 'true' : 'false'}
          </p>
          <p>
            userId:
            {userId || 'null'}
          </p>
          <p>
            orgId:
            {orgId || 'null'}
          </p>
        </div>
        {!isLoaded && <p className="mt-4 text-gray-600">Loading Clerk...</p>}
        {isLoaded && !userId && <p className="mt-4 text-red-600">Not authenticated</p>}
        {isLoaded && userId && !orgId && <p className="mt-4 text-blue-600">Ready to select organization</p>}
      </div>
    </div>
  );
};

export const dynamic = 'force-dynamic';

export default OrganizationSelectionPage;
