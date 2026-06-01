'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { PublicShell } from '@/components/PublicShell';
import { CategoryStrip } from '@/components/CategoryStrip';
import { ProductCard } from '@/components/ProductCard';
import { SearchBar } from '@/components/SearchBar';
import { useAuth } from '@/lib/auth-store';
import { api } from '@/lib/api';
import type { Category, Product } from '@/lib/types';
import { cn } from '@/lib/format';

const sortOptions = ['newest', 'price_asc', 'price_desc', 'name'] as const;

export function CatalogView() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const params = useSearchParams();
  const wholesaleToken = useAuth((s) => s.wholesaleToken);
  const isWholesale = !!wholesaleToken;

  const category = params.get('category') || '';
  const q = params.get('q') || '';
  const sort = params.get('sort') || 'newest';

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api
      .listCategories()
      .then((c) => !cancelled && setCategories(c.data))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .listProducts(
        {
          category: category || undefined,
          q: q || undefined,
          sort,
          limit: 60,
        },
        wholesaleToken
      )
      .then((res) => !cancelled && setProducts(res.data))
      .catch(() => !cancelled && setProducts([]))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [category, q, sort, wholesaleToken]);

  const setQuery = (next: Record<string, string | null>) => {
    const u = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(next)) {
      if (v === null || v === '') u.delete(k);
      else u.set(k, v);
    }
    const localePrefix = locale === 'es' ? '' : `/${locale}`;
    const qs = u.toString();
    router.push(`${localePrefix}/catalog${qs ? `?${qs}` : ''}`);
  };

  const heading = useMemo(() => {
    if (!category) return t('product.all');
    const c = categories.find((x) => x.slug === category);
    if (!c) return t('product.all');
    return locale === 'es' ? c.name_es : c.name_en;
  }, [category, categories, locale, t]);

  return (
    <PublicShell>
      <div className="space-y-4">
        <SearchBar initialValue={q} />

        {categories.length > 0 && (
          <div className="-mt-1">
            <CategoryStrip categories={categories} activeSlug={category} />
          </div>
        )}

        <div className="flex items-center justify-between">
          <h1 className="text-base font-bold text-brand-900">{heading}</h1>
          <select
            value={sort}
            onChange={(e) => setQuery({ sort: e.target.value })}
            className="rounded-full border border-brand-200 bg-white px-3 py-1.5 text-xs font-medium text-brand-800 focus:outline-none"
          >
            {sortOptions.map((s) => (
              <option key={s} value={s}>
                {t(`product.sort.${s}` as 'product.sort.newest')}
              </option>
            ))}
          </select>
        </div>

        {category && (
          <button
            onClick={() => setQuery({ category: null })}
            className={cn(
              'text-xs font-semibold text-brand-700 underline-offset-2 hover:underline'
            )}
          >
            ← {t('common.back')} / {t('product.all')}
          </button>
        )}

        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-72 animate-pulse rounded-2xl bg-brand-50"
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center text-sm text-brand-700/70 shadow-soft">
            {t('product.noResults')}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                variant={isWholesale ? 'wholesale' : 'retail'}
              />
            ))}
          </div>
        )}
      </div>
    </PublicShell>
  );
}
