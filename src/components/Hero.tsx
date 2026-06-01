'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';

export function Hero() {
  const t = useTranslations('home');
  const locale = useLocale();
  const localePrefix = locale === 'es' ? '' : `/${locale}`;

  return (
    <section className="overflow-hidden rounded-3xl bg-brand-50">
      <div className="grid grid-cols-5 items-center gap-2 p-4">
        <div className="col-span-3 space-y-3">
          <h1 className="font-display text-2xl font-extrabold leading-tight text-brand-900 sm:text-3xl">
            {t('heroTitle')}
          </h1>
          <p className="text-xs text-brand-700/80">{t('heroSubtitle')}</p>
          <Link href={`${localePrefix}/catalog`} className="btn-primary">
            {t('heroCta')}
          </Link>
        </div>
        <div className="relative col-span-2 aspect-square">
          <Image
            src="https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=70"
            alt="Plants"
            fill
            sizes="(max-width: 768px) 40vw, 240px"
            className="rounded-2xl object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
}
