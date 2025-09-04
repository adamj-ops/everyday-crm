import { clerkMiddleware } from '@clerk/nextjs/server';
import createMiddleware from 'next-intl/middleware';

import { AllLocales, AppConfig } from './utils/AppConfig';

const intlMiddleware = createMiddleware({
  locales: AllLocales,
  localePrefix: AppConfig.localePrefix,
  defaultLocale: AppConfig.defaultLocale,
});

export default clerkMiddleware(async (auth, req) => {
  // Protect specific routes
  if (
    req.nextUrl.pathname.startsWith('/dashboard')
    || req.nextUrl.pathname.startsWith('/deals')
    || req.nextUrl.pathname.startsWith('/onboarding')
    || req.nextUrl.pathname.startsWith('/api/deals')
    || req.nextUrl.pathname.startsWith('/api/offers')
    || req.nextUrl.pathname.startsWith('/api/documents')
  ) {
    await auth.protect();
  }

  // Check for organization selection redirect
  const authObj = await auth();
  if (
    authObj.userId
    && !authObj.orgId
    && (req.nextUrl.pathname.includes('/dashboard') || req.nextUrl.pathname.includes('/deals'))
    && !req.nextUrl.pathname.includes('/organization-selection')
    && !req.nextUrl.pathname.includes('/onboarding')
  ) {
    // Extract locale from pathname for proper redirect
    const localeMatch = req.nextUrl.pathname.match(/^\/([a-z]{2})\//);
    const locale = localeMatch ? localeMatch[1] : '';
    const orgSelection = new URL(`${locale}/onboarding/organization-selection`, req.url);
    return Response.redirect(orgSelection);
  }

  return intlMiddleware(req);
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next|monitoring).*)', '/', '/(api|trpc)(.*)'], // Also exclude tunnelRoute used in Sentry from the matcher
};
