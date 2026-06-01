'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowLeft, Minus, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { PublicShell } from '@/components/PublicShell';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-store';
import { useCart } from '@/lib/cart-store';
import { cn, formatPrice } from '@/lib/format';
import type { Product } from '@/lib/types';

interface Props {
  productId: string;
}

export function ProductView({ productId }: Props) {
  const t = useTranslations();
  const locale = useLocale();
  const wholesaleToken = useAuth((s) => s.wholesaleToken);
  const isWholesale = !!wholesaleToken;
  const add = useCart((s) => s.add);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(isWholesale ? 10 : 1);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .getProduct(productId, wholesaleToken)
      .then((res) => !cancelled && setProduct(res.data))
      .catch(() => !cancelled && setProduct(null))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [productId, wholesaleToken]);

  const localePrefix = locale === 'es' ? '' : `/${locale}`;

  if (loading) {
    return (
      <PublicShell>
        <div className="h-96 animate-pulse rounded-3xl bg-brand-50" />
      </PublicShell>
    );
  }
  if (!product) {
    return (
      <PublicShell>
        <div className="rounded-2xl bg-white p-8 text-center text-sm text-brand-700/70 shadow-soft">
          {t('product.noResults')}
          <div className="mt-3">
            <Link href={`${localePrefix}/catalog`} className="btn-primary">
              {t('list.browse')}
            </Link>
          </div>
        </div>
      </PublicShell>
    );
  }

  const name = locale === 'es' ? product.name_es : product.name_en;
  const description = locale === 'es' ? product.description_es : product.description_en;
  const stockKey = product.stock_status;
  const stockColors: Record<string, string> = {
    in_stock: 'text-brand-600',
    low_stock: 'text-orange-500',
    out_of_stock: 'text-accent-500',
  };

  const images = product.images.length
    ? product.images
    : [{ id: '_', url: '', alt_text: name, sort_order: 0, is_primary: true, is_video: false }];

  return (
    <PublicShell>
      <Link
        href={`${localePrefix}/catalog`}
        className="mb-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-700"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('common.back')}
      </Link>

      <div className="space-y-4">
        <div className="relative aspect-square overflow-hidden rounded-3xl bg-brand-50">
          {images[activeImg]?.url ? (
            <Image
              src={images[activeImg].url}
              alt={images[activeImg].alt_text || name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 480px"
              className="object-cover"
            />
          ) : null}
        </div>

        {images.length > 1 && (
          <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
            {images.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setActiveImg(i)}
                className={cn(
                  'relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2',
                  i === activeImg ? 'border-brand-600' : 'border-transparent'
                )}
              >
                <Image
                  src={img.url}
                  alt={img.alt_text || name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}

        <div>
          {product.promotion_text && (
            <span className="chip mb-2 bg-brand-100 text-brand-800">
              {product.promotion_text}
            </span>
          )}
          <h1 className="font-display text-2xl font-extrabold text-brand-900">
            {name}
          </h1>
          {product.pot_size && (
            <div className="text-sm text-brand-700/70">{product.pot_size}</div>
          )}
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-soft ring-1 ring-brand-100">
          {isWholesale && product.wholesale_price ? (
            <>
              <div className="text-[10px] font-semibold uppercase tracking-wide text-brand-700">
                {t('product.wholesalePrice')}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-brand-700">
                  {formatPrice(product.wholesale_price)}
                </span>
                <span className="text-sm text-brand-700/50 line-through">
                  {formatPrice(product.retail_price)}
                </span>
              </div>
              <div className="text-xs text-brand-700/60">
                {t('product.from', { n: 10 })}
              </div>
            </>
          ) : (
            <div className="text-3xl font-extrabold text-brand-700">
              {formatPrice(product.retail_price)}
            </div>
          )}
          <div
            className={cn(
              'mt-2 flex items-center gap-2 text-sm font-semibold',
              stockColors[stockKey]
            )}
          >
            <span className="h-2 w-2 rounded-full bg-current" />
            {t(`product.stock.${stockKey}` as 'product.stock.in_stock')}
          </div>
        </div>

        {description && (
          <p className="text-sm leading-relaxed text-brand-800/80">
            {description}
          </p>
        )}

        <div className="sticky bottom-20 z-10 flex items-center gap-3 rounded-2xl bg-white p-3 shadow-card ring-1 ring-brand-100">
          <div className="flex items-center rounded-full border border-brand-200">
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="grid h-9 w-9 place-items-center text-brand-700"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="min-w-[2rem] text-center text-base font-bold text-brand-800">
              {qty}
            </span>
            <button
              onClick={() => setQty(qty + 1)}
              className="grid h-9 w-9 place-items-center text-brand-700"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <button
            onClick={() => add(product, qty)}
            disabled={product.stock_status === 'out_of_stock'}
            className="btn-primary flex-1 !py-3"
          >
            {t('product.addToList')}
          </button>
        </div>
      </div>
    </PublicShell>
  );
}
