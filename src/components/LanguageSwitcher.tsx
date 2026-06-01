'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { locales, type Locale } from '@/i18n/config';
import { cn } from '@/lib/format';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchTo = (next: Locale) => {
    if (next === locale) return;

    const params = new URLSearchParams(window.location.search);
    const query = Object.fromEntries(params.entries());
    const href =
      Object.keys(query).length > 0 ? { pathname, query } : pathname;

    router.replace(href, { locale: next });
  };

  return (
    <div className="inline-flex overflow-hidden rounded-full border border-brand-200">
      {locales.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => switchTo(l)}
          className={cn(
            'px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition',
            l === locale
              ? 'bg-brand-700 text-white'
              : 'bg-white text-brand-700 hover:bg-brand-50'
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
