'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { ChevronRight, Sparkles } from 'lucide-react';
import { PublicShell } from '@/components/PublicShell';
import { Hero } from '@/components/Hero';
import { WholesaleHero } from '@/components/WholesaleHero';
import { SearchBar } from '@/components/SearchBar';
import { CategoryStrip } from '@/components/CategoryStrip';
import { ProductCard } from '@/components/ProductCard';
import { Perks } from '@/components/Perks';
import { WhatsAppHelpCard } from '@/components/WhatsAppHelpCard';
import { WholesaleShippingCard } from '@/components/WholesaleShippingCard';
import { useAuth } from '@/lib/auth-store';
import { api } from '@/lib/api';
import type { Category, Product } from '@/lib/types';

export function HomeView() {
  const t = useTranslations();
  const locale = useLocale();
  const localePrefix = locale === 'es' ? '' : `/${locale}`;
  const wholesaleToken = useAuth((s) => s.wholesaleToken);
  const isWholesale = !!wholesaleToken;

  const [categories, setCategories] = useState<Category[]>([]);
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([
      api.listCategories(),
      api.listProducts(
        { featured: 1, limit: 6 },
        wholesaleToken
      ),
    ])
      .then(([cats, prods]) => {
        if (cancelled) return;
        setCategories(cats.data);
        setFeatured(prods.data);
      })
      .catch(() => {})
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [wholesaleToken]);

  return (
    <PublicShell>
      <div className="space-y-4">
        {isWholesale ? <WholesaleHero /> : <Hero />}

        <SearchBar />

        {categories.length > 0 && (
          <CategoryStrip categories={categories} />
        )}

        <section>
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-brand-700" />
              <h2 className="text-sm font-semibold text-brand-900">
                {isWholesale
                  ? t('home.wholesaleTitle')
                  : t('home.featuredTitle')}
              </h2>
            </div>
            <Link
              href={`${localePrefix}/catalog`}
              className="flex items-center text-xs font-semibold text-brand-700"
            >
              {t('home.viewAll')}
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          {isWholesale && (
            <p className="-mt-1 mb-2 text-[11px] text-brand-700/70">
              {t('home.wholesaleSubtitle')}
            </p>
          )}
          {loading ? (
            <div className="product-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-72 animate-pulse rounded-2xl bg-brand-50" />
              ))}
            </div>
          ) : featured.length === 0 ? (
            <div className="rounded-2xl bg-white p-6 text-center text-sm text-brand-700/70 shadow-soft">
              {t('product.noResults')}
            </div>
          ) : (
            <div className="product-grid">
              {featured.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  variant={isWholesale ? 'wholesale' : 'retail'}
                />
              ))}
            </div>
          )}
        </section>

        {!isWholesale && <Perks />}

        {isWholesale ? <WholesaleShippingCard /> : <WhatsAppHelpCard />}
      </div>
    </PublicShell>
  );
}
