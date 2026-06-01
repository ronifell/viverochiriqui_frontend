'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { ChevronRight, EyeOff, Plus, Search } from 'lucide-react';
import { AdminShell } from '@/components/admin/AdminShell';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-store';
import { cn, formatPrice } from '@/lib/format';
import type { Product } from '@/lib/types';

export function AdminProductsView() {
  const t = useTranslations('admin');
  const tProduct = useTranslations('product');
  const locale = useLocale();
  const localePrefix = locale === 'es' ? '' : `/${locale}`;
  const adminToken = useAuth((s) => s.adminToken);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');

  const reload = () => {
    if (!adminToken) return;
    setLoading(true);
    api
      .listProducts({ limit: 200, q: q || undefined }, adminToken)
      .then((r) => setProducts(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!adminToken) return;
    const id = setTimeout(reload, 250);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminToken, q]);

  return (
    <AdminShell>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-brand-900">{t('products')}</h1>
        <Link
          href={`${localePrefix}/admin/products/new`}
          className="btn-primary !py-2 !px-3 !text-xs"
        >
          <Plus className="h-4 w-4" />
          {t('newProduct')}
        </Link>
      </div>

      <div className="mt-3 flex items-center gap-2 rounded-2xl bg-white px-3 shadow-soft ring-1 ring-brand-100">
        <Search className="h-4 w-4 text-brand-700/60" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t('products')}
          className="w-full bg-transparent py-3 text-sm text-brand-900 outline-none"
        />
      </div>

      {loading ? (
        <div className="mt-4 space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-brand-50" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="mt-6 rounded-2xl bg-white p-6 text-center text-sm text-brand-700/70 shadow-soft">
          {t('noProducts')}
          <div className="mt-3">
            <Link
              href={`${localePrefix}/admin/products/new`}
              className="btn-primary"
            >
              {t('createFirst')}
            </Link>
          </div>
        </div>
      ) : (
        <ul className="mt-4 space-y-2">
          {products.map((p) => {
            const name = locale === 'es' ? p.name_es : p.name_en;
            const primary = p.images.find((i) => i.is_primary) || p.images[0];
            return (
              <li key={p.id}>
                <Link
                  href={`${localePrefix}/admin/products/${p.id}`}
                  className={cn(
                    'flex items-center gap-3 rounded-2xl bg-white p-3 shadow-soft ring-1 ring-brand-100',
                    !p.is_active && 'opacity-60'
                  )}
                >
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-brand-50">
                    {primary?.url ? (
                      <Image
                        src={primary.url}
                        alt={name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="line-clamp-1 text-sm font-semibold text-brand-900">
                        {name}
                      </span>
                      {!p.is_active && (
                        <EyeOff className="h-3.5 w-3.5 text-brand-700/60" />
                      )}
                    </div>
                    <div className="text-[11px] text-brand-700/60">
                      {p.pot_size} {p.pot_size && p.category ? '·' : ''}{' '}
                      {p.category
                        ? locale === 'es'
                          ? p.category.name_es
                          : p.category.name_en
                        : t('noCategory')}
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-sm font-bold text-brand-700">
                        {formatPrice(p.retail_price)}
                      </span>
                      <span className="text-[11px] text-brand-700/60">
                        / {p.wholesale_price ? formatPrice(p.wholesale_price) : '—'}
                      </span>
                      <span
                        className={cn(
                          'chip',
                          p.stock_status === 'in_stock' &&
                            'bg-brand-50 text-brand-700',
                          p.stock_status === 'low_stock' &&
                            'bg-orange-50 text-orange-700',
                          p.stock_status === 'out_of_stock' &&
                            'bg-accent-50 text-accent-700'
                        )}
                      >
                        {tProduct(`stock.${p.stock_status}` as 'stock.in_stock')}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-brand-700/50" />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </AdminShell>
  );
}
