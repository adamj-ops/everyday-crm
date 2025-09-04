'use client';

import { useAuth, UserButton } from '@clerk/nextjs';

const TestClerkPage = () => {
  const { isLoaded, userId, orgId } = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="space-y-4 text-center">
        <h1 className="text-3xl font-bold">Clerk Test Page</h1>

        <div className="rounded bg-gray-100 p-4">
          <h2 className="mb-2 text-xl font-semibold">Auth State:</h2>
          <p>
            isLoaded:
            {isLoaded ? '✅ true' : '❌ false'}
          </p>
          <p>
            userId:
            {userId || '❌ null'}
          </p>
          <p>
            orgId:
            {orgId || '❌ null'}
          </p>
        </div>

        {isLoaded && userId && (
          <div className="rounded bg-green-100 p-4">
            <p className="text-green-800">✅ Clerk is working!</p>
            <div className="mt-2">
              <UserButton />
            </div>
          </div>
        )}

        {isLoaded && !userId && (
          <div className="rounded bg-red-100 p-4">
            <p className="text-red-800">❌ Not authenticated</p>
          </div>
        )}

        {!isLoaded && (
          <div className="rounded bg-yellow-100 p-4">
            <p className="text-yellow-800">⏳ Loading Clerk...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export const dynamic = 'force-dynamic';

export default TestClerkPage;
