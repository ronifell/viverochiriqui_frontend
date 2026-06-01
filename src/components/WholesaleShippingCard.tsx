'use client';

import { Truck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { whatsappUrl } from '@/lib/whatsapp';

export function WholesaleShippingCard() {
  const t = useTranslations('home');
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-soft ring-1 ring-brand-100">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-700 text-white">
        <Truck className="h-5 w-5" />
      </span>
      <div className="flex-1">
        <div className="text-sm font-semibold text-brand-900">
          {t('shippingTitle')}
        </div>
        <div className="text-xs text-brand-700/70">{t('shippingDesc')}</div>
      </div>
      <a
        href={whatsappUrl(t('shippingDesc'))}
        target="_blank"
        rel="noopener"
        className="btn-outline !py-1.5 !px-3 !text-[11px]"
      >
        {t('moreInfo')}
      </a>
    </div>
  );
}
