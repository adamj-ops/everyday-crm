import { OrganizationList } from '@clerk/nextjs';
import { getTranslations } from 'next-intl/server';

import { AppConfig } from '@/utils/AppConfig';

export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: 'Dashboard',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

const OrganizationSelectionPage = (props: { params: { locale: string } }) => {
  // Build locale-aware URLs
  const dashboardUrl = props.params.locale === AppConfig.defaultLocale
    ? '/dashboard'
    : `/${props.params.locale}/dashboard`;

  return (
    <div className="flex min-h-screen items-center justify-center">
      <OrganizationList
        afterSelectOrganizationUrl={dashboardUrl}
        afterCreateOrganizationUrl={dashboardUrl}
        hidePersonal
        skipInvitationScreen
      />
    </div>
  );
};

export const dynamic = 'force-dynamic';

export default OrganizationSelectionPage;
