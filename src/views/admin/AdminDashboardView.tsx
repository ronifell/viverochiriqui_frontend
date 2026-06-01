'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Boxes, FolderTree, Plus, AlertCircle } from 'lucide-react';
import { AdminShell } from '@/components/admin/AdminShell';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-store';
import type { Category, Product } from '@/lib/types';

export function AdminDashboardView() {
  const t = useTranslations('admin');
  const locale = useLocale();
  const adminToken = useAuth((s) => s.adminToken);
  const localePrefix = locale === 'es' ? '' : `/${locale}`;

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!adminToken) return;
    let cancelled = false;
    Promise.all([
      api.listProducts({ limit: 100 }, adminToken),
      api.listCategories(adminToken),
    ])
      .then(([p, c]) => {
        if (cancelled) return;
        setProducts(p.data);
        setCategories(c.data);
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [adminToken]);

  const active = products.filter((p) => p.is_active).length;
  const out = products.filter((p) => p.stock_status === 'out_of_stock').length;

  return (
    <AdminShell>
      <div className="space-y-4">
        <h1 className="text-lg font-bold text-brand-900">{t('dashboard')}</h1>

        <div className="grid grid-cols-2 gap-3">
          <Stat label={t('stats.products')} value={products.length} />
          <Stat label={t('stats.categories')} value={categories.length} />
          <Stat label={t('stats.active')} value={active} />
          <Stat label={t('stats.outOfStock')} value={out} highlight />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Link
            href={`${localePrefix}/admin/products`}
            className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-soft ring-1 ring-brand-100 hover:bg-brand-50"
          >
            <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-50 text-brand-700">
              <Boxes className="h-5 w-5" />
            </span>
            <div>
              <div className="text-sm font-semibold text-brand-900">
                {t('products')}
              </div>
              <div className="text-xs text-brand-700/70">
                {t('stats.products')}: {products.length}
              </div>
            </div>
          </Link>

          <Link
            href={`${localePrefix}/admin/categories`}
            className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-soft ring-1 ring-brand-100 hover:bg-brand-50"
          >
            <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-50 text-brand-700">
              <FolderTree className="h-5 w-5" />
            </span>
            <div>
              <div className="text-sm font-semibold text-brand-900">
                {t('categories')}
              </div>
              <div className="text-xs text-brand-700/70">
                {t('stats.categories')}: {categories.length}
              </div>
            </div>
          </Link>
        </div>

        <Link
          href={`${localePrefix}/admin/products/new`}
          className="btn-primary w-full !py-3"
        >
          <Plus className="h-4 w-4" />
          {t('newProduct')}
        </Link>

        {!loading && products.length === 0 && (
          <div className="flex items-center gap-3 rounded-2xl bg-white p-4 text-sm text-brand-700/70 ring-1 ring-brand-100">
            <AlertCircle className="h-4 w-4 text-brand-700" />
            {t('noProducts')}
          </div>
        )}
      </div>
    </AdminShell>
  );
}

function Stat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-soft ring-1 ring-brand-100">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-brand-700/70">
        {label}
      </div>
      <div
        className={
          highlight && value > 0
            ? 'text-2xl font-extrabold text-accent-600'
            : 'text-2xl font-extrabold text-brand-900'
        }
      >
        {value}
      </div>
    </div>
  );
}
