'use client';

import { useTranslations } from 'next-intl';
import { Truck, ShieldCheck, Headphones, Leaf } from 'lucide-react';

export function Perks() {
  const t = useTranslations('home.perks');

  const items = [
    { icon: Truck, key: 'delivery' },
    { icon: ShieldCheck, key: 'healthy' },
    { icon: Headphones, key: 'advice' },
    { icon: Leaf, key: 'fairPrice' },
  ] as const;

  return (
    <div className="grid grid-cols-4 gap-2 rounded-2xl bg-white p-3 shadow-soft ring-1 ring-brand-100 lg:gap-6 lg:p-6">
      {items.map(({ icon: Icon, key }) => (
        <div
          key={key}
          className="flex flex-col items-center gap-1 text-center lg:gap-2"
        >
          <Icon className="h-5 w-5 text-brand-700 lg:h-6 lg:w-6" />
          <div className="text-[11px] font-semibold leading-tight text-brand-900 lg:text-sm">
            {t(`${key}.title`)}
          </div>
          <div className="text-[10px] leading-tight text-brand-700/70 lg:text-xs">
            {t(`${key}.desc`)}
          </div>
        </div>
      ))}
    </div>
  );
}
