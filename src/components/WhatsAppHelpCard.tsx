'use client';

import { MessageCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { whatsappUrl } from '@/lib/whatsapp';

export function WhatsAppHelpCard() {
  const t = useTranslations('home');
  const href = whatsappUrl(
    t('helpDesc') /* Provide a default greeting via the desc */
  );

  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-soft ring-1 ring-brand-100">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-whatsapp/10 text-whatsapp">
        <MessageCircle className="h-5 w-5" />
      </span>
      <div className="flex-1">
        <div className="text-sm font-semibold text-brand-900">
          {t('helpTitle')}
        </div>
        <div className="text-xs text-brand-700/70">{t('helpDesc')}</div>
      </div>
      <a href={href} target="_blank" rel="noopener" className="btn-whatsapp">
        {t('helpCta')}
      </a>
    </div>
  );
}
