'use client';

import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { PublicShell } from '@/components/PublicShell';
import { WhatsAppLink } from '@/components/WhatsAppLink';
import { getWhatsAppPhone } from '@/lib/whatsapp';

export function ContactView() {
  const t = useTranslations();
  const businessEmail =
    process.env.NEXT_PUBLIC_BUSINESS_EMAIL || 'ventas@viverochiriqui.com';
  const phone = getWhatsAppPhone();

  return (
    <PublicShell>
      <div className="space-y-4">
        <h1 className="text-lg font-bold text-brand-900 lg:text-2xl">{t('nav.contact')}</h1>

        <div className="space-y-4 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
        <WhatsAppLink
          message={t('home.helpDesc')}
          className="flex items-center gap-3 rounded-2xl bg-whatsapp p-4 text-white shadow-card lg:col-span-2 lg:p-6"
        >
          <span className="grid h-10 w-10 place-items-center rounded-full bg-white/15">
            <MessageCircle className="h-5 w-5" />
          </span>
          <div className="flex-1">
            <div className="text-base font-bold">WhatsApp</div>
            <div className="text-xs text-white/85">+{phone}</div>
          </div>
        </WhatsAppLink>

        <a
          href={`tel:+${phone}`}
          className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-soft ring-1 ring-brand-100"
        >
          <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-50 text-brand-700">
            <Phone className="h-5 w-5" />
          </span>
          <div>
            <div className="text-sm font-semibold text-brand-900">
              {t('nav.contact')}
            </div>
            <div className="text-xs text-brand-700/70">+{phone}</div>
          </div>
        </a>

        <a
          href={`mailto:${businessEmail}`}
          className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-soft ring-1 ring-brand-100"
        >
          <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-50 text-brand-700">
            <Mail className="h-5 w-5" />
          </span>
          <div>
            <div className="text-sm font-semibold text-brand-900">Email</div>
            <div className="text-xs text-brand-700/70">{businessEmail}</div>
          </div>
        </a>

        <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-soft ring-1 ring-brand-100">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-50 text-brand-700">
            <MapPin className="h-5 w-5" />
          </span>
          <div>
            <div className="text-sm font-semibold text-brand-900">
              Vivero Chiriquí
            </div>
            <div className="text-xs text-brand-700/70">
              David, Chiriquí, Panamá
            </div>
          </div>
        </div>

        </div>

        <p className="text-center text-[11px] text-brand-700/60">
          {t('footer.legal')}
        </p>
      </div>
    </PublicShell>
  );
}
