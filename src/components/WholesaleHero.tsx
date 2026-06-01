'use client';

import { useTranslations } from 'next-intl';
import { Crown } from 'lucide-react';

export function WholesaleHero() {
  const t = useTranslations('home');

  return (
    <section className="rounded-3xl bg-brand-50 p-4 lg:p-6">
      <div className="flex items-start gap-3 lg:items-center lg:gap-4">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand-700 text-white">
          <Crown className="h-5 w-5" />
        </span>
        <div className="flex-1">
          <div className="font-display text-base font-extrabold text-brand-900">
            {t('wholesaleCatalog')}
          </div>
          <div className="text-xs text-brand-700/80">
            {t('wholesaleCatalogSub')}
          </div>
          <div className="mt-1 text-[11px] text-brand-700/70">
            {t('minimumNote')}
          </div>
        </div>
        <button className="btn-outline !py-1.5 !px-3 !text-[11px]">
          {t('promoCta')}
        </button>
      </div>
    </section>
  );
}
