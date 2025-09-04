'use client';

import { OrganizationList, useAuth } from '@clerk/nextjs';
import { useEffect } from 'react';

import { AppConfig } from '@/utils/AppConfig';

const OrganizationSelectionPage = (props: { params: { locale: string } }) => {
  const { isLoaded, userId, orgId } = useAuth();

  // Build locale-aware URLs
  const dashboardUrl = props.params.locale === AppConfig.defaultLocale
    ? '/dashboard'
    : `/${props.params.locale}/dashboard`;

  useEffect(() => {
    // Debug auth state (remove in production)
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log('Organization Selection Page - Auth State:', {
        isLoaded,
        userId,
        orgId,
        locale: props.params.locale,
        dashboardUrl,
      });
    }
  }, [isLoaded, userId, orgId, props.params.locale, dashboardUrl]);

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto size-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Not authenticated</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="mb-6 text-center text-2xl font-bold">Select Organization</h1>
        <OrganizationList
          afterSelectOrganizationUrl={dashboardUrl}
          afterCreateOrganizationUrl={dashboardUrl}
          hidePersonal
          skipInvitationScreen
        />
      </div>
    </div>
  );
};

export const dynamic = 'force-dynamic';

export default OrganizationSelectionPage;
