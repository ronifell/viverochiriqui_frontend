import createMiddleware from 'next-intl/middleware';
import { defaultLocale, locales } from './i18n/config';

export default createMiddleware({
  locales: [...locales],
  defaultLocale,
  localePrefix: 'as-needed',
});

export const config = {
  matcher: [
    // Skip Next.js internals, static files, and API routes
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};
