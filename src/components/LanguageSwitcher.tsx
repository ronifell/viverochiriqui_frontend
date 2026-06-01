'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { locales, type Locale } from '@/i18n/config';
import { cn } from '@/lib/format';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchTo = (next: Locale) => {
    if (next === locale) return;

    const segments = pathname.split('/');
    if (segments[1] && (locales as readonly string[]).includes(segments[1])) {
      segments[1] = next;
    } else {
      segments.splice(1, 0, next);
    }
    let newPath = segments.join('/') || '/';
    if (next === 'es') {
      // Default locale: drop prefix
      newPath = newPath.replace(/^\/es(\/|$)/, '/');
      if (!newPath.startsWith('/')) newPath = `/${newPath}`;
    }
    router.push(newPath);
  };

  return (
    <div className="inline-flex overflow-hidden rounded-full border border-brand-200">
      {locales.map((l) => (
        <button
          key={l}
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
