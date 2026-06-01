'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { ClipboardList, Crown, Minus, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { PublicShell } from '@/components/PublicShell';
import { useCart } from '@/lib/cart-store';
import { useAuth } from '@/lib/auth-store';
import { formatPrice } from '@/lib/format';
import { buildOrderMessage, whatsappUrl } from '@/lib/whatsapp';
import type { Locale } from '@/i18n/config';

export function ListView() {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const localePrefix = locale === 'es' ? '' : `/${locale}`;

  const items = useCart((s) => s.items);
  const note = useCart((s) => s.note);
  const setNote = useCart((s) => s.setNote);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const clear = useCart((s) => s.clear);
  const isWholesale = useAuth((s) => !!s.wholesaleToken);
  const totalEstimate = useCart((s) => s.totalEstimate(isWholesale));
  const totalItems = useCart((s) => s.totalItems());

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  if (hydrated && items.length === 0) {
    return (
      <PublicShell>
        <div className="mt-12 flex flex-col items-center text-center">
          <div className="grid h-20 w-20 place-items-center rounded-full bg-brand-50">
            <ClipboardList className="h-9 w-9 text-brand-700" />
          </div>
          <h1 className="mt-4 text-lg font-bold text-brand-900">
            {t('list.empty')}
          </h1>
          <p className="mt-1 max-w-sm text-sm text-brand-700/70">
            {t('list.emptyDesc')}
          </p>
          <Link
            href={`${localePrefix}/catalog`}
            className="btn-primary mt-5"
          >
            {t('list.browse')}
          </Link>
        </div>
      </PublicShell>
    );
  }

  const message = buildOrderMessage({
    locale,
    isWholesale,
    note,
    items,
  });

  return (
    <PublicShell>
      <div className="space-y-4 lg:grid lg:grid-cols-3 lg:items-start lg:gap-8 lg:space-y-0">
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-brand-900 lg:text-xl">
              {t('list.title')}
            </h1>
            <button
              type="button"
              onClick={clear}
              className="text-xs font-semibold text-accent-600 hover:underline"
            >
              {t('list.clear')}
            </button>
          </div>

          {isWholesale && (
            <div className="flex items-center gap-2 rounded-2xl bg-brand-700 px-3 py-2 text-xs font-semibold text-white">
              <Crown className="h-4 w-4" />
              {t('list.wholesaleMode')}
            </div>
          )}

          <ul className="space-y-2">
            {items.map((i) => {
              const name = locale === 'es' ? i.name_es : i.name_en;
              const price =
                isWholesale && i.wholesale_price
                  ? i.wholesale_price
                  : i.retail_price;
              return (
                <li
                  key={i.product_id}
                  className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-soft ring-1 ring-brand-100 lg:p-4"
                >
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-brand-50 lg:h-20 lg:w-20">
                    {i.image_url && (
                      <Image
                        src={i.image_url}
                        alt={name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="line-clamp-1 text-sm font-semibold text-brand-900 lg:text-base">
                      {name}
                    </div>
                    {i.pot_size && (
                      <div className="text-[11px] text-brand-700/60 lg:text-xs">
                        {i.pot_size}
                      </div>
                    )}
                    <div className="mt-1 flex items-baseline gap-1.5">
                      <span className="text-sm font-bold text-brand-700 lg:text-base">
                        {formatPrice(price)}
                      </span>
                      {isWholesale && i.wholesale_price && (
                        <span className="text-[11px] text-brand-700/50 line-through">
                          {formatPrice(i.retail_price)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <div className="flex items-center rounded-full border border-brand-200">
                      <button
                        onClick={() => setQty(i.product_id, Math.max(1, i.qty - 1))}
                        className="grid h-7 w-7 place-items-center text-brand-700"
                        aria-label="decrease"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <input
                        type="number"
                        min={1}
                        value={i.qty}
                        onChange={(e) =>
                          setQty(i.product_id, parseInt(e.target.value || '1', 10))
                        }
                        className="w-9 bg-transparent text-center text-sm font-semibold text-brand-800 outline-none"
                      />
                      <button
                        onClick={() => setQty(i.product_id, i.qty + 1)}
                        className="grid h-7 w-7 place-items-center text-brand-700"
                        aria-label="increase"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <button
                      onClick={() => remove(i.product_id)}
                      className="flex items-center gap-1 text-[11px] font-semibold text-accent-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      {t('list.remove')}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="rounded-2xl bg-white p-4 shadow-soft ring-1 ring-brand-100 lg:hidden">
            <label className="mb-1.5 block text-xs font-semibold text-brand-800">
              {t('list.noteLabel')}
            </label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t('list.notePlaceholder')}
              className="w-full resize-none rounded-xl border border-brand-100 bg-brand-50/50 px-3 py-2 text-sm text-brand-900 outline-none focus:border-brand-400"
            />
          </div>
        </div>

        <div className="space-y-4 lg:sticky lg:top-24">
          <div className="hidden rounded-2xl bg-white p-4 shadow-soft ring-1 ring-brand-100 lg:block">
            <label className="mb-1.5 block text-xs font-semibold text-brand-800">
              {t('list.noteLabel')}
            </label>
            <textarea
              rows={4}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t('list.notePlaceholder')}
              className="w-full resize-none rounded-xl border border-brand-100 bg-brand-50/50 px-3 py-2 text-sm text-brand-900 outline-none focus:border-brand-400"
            />
          </div>

          <div className="sticky bottom-20 z-10 rounded-2xl bg-brand-700 p-4 text-white shadow-card lg:static lg:bottom-auto">
            <div className="flex items-center justify-between lg:flex-col lg:items-stretch lg:gap-4">
              <div>
                <div className="text-[11px] uppercase tracking-wide text-white/70">
                  {t('list.items', { n: totalItems })}
                </div>
                <div className="text-xl font-extrabold lg:text-2xl">
                  {formatPrice(totalEstimate)}
                </div>
                <div className="text-[10px] text-white/60">
                  {t('list.subtotal')}
                </div>
              </div>
              <a
                href={whatsappUrl(message)}
                target="_blank"
                rel="noopener"
                className="btn-whatsapp lg:w-full lg:justify-center"
              >
                {t('list.send')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </PublicShell>
  );
}
