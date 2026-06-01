import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';
import { defaultLocale, isLocale } from './config';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const active = requested && isLocale(requested) ? requested : defaultLocale;
  if (!isLocale(active)) notFound();
  return {
    locale: active,
    messages: (await import(`../messages/${active}.json`)).default,
  };
});
