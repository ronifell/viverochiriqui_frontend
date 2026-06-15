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
      <div className="grid grid-cols-5 items-center gap-2 p-4 lg:grid-cols-2 lg:gap-10 lg:p-8">
        <div className="col-span-3 space-y-3 lg:col-span-1 lg:space-y-4">
          <h1 className="font-display text-2xl font-extrabold leading-tight text-brand-900 sm:text-3xl lg:text-4xl xl:text-5xl">
            {t('heroTitle')}
          </h1>
          <p className="text-xs text-brand-700/80 lg:text-base">{t('heroSubtitle')}</p>
          <Link href={`${localePrefix}/catalog`} className="btn-primary lg:!px-6 lg:!py-3 lg:text-base">
            {t('heroCta')}
          </Link>
        </div>
        <div className="relative col-span-2 aspect-square lg:col-span-1 lg:aspect-[4/3]">
          <Image
            src="/flower.PNG"
            alt="Plantas florales"
            fill
            sizes="(max-width: 1024px) 40vw, 560px"
            className="rounded-2xl object-cover lg:rounded-3xl"
            priority
          />
        </div>
      </div>
    </section>
  );
}
