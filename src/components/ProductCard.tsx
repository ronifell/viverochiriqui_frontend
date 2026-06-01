'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, Minus, Plus } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-store';
import { useCart } from '@/lib/cart-store';
import { cn, formatPrice } from '@/lib/format';
import { resolveMediaUrl } from '@/lib/media';
import { useStoreHydrated } from '@/lib/use-store-hydrated';
import type { Product } from '@/lib/types';

interface Props {
  product: Product;
  variant?: 'retail' | 'wholesale';
}

const stockColor: Record<Product['stock_status'], string> = {
  in_stock: 'text-brand-600',
  low_stock: 'text-orange-500',
  out_of_stock: 'text-accent-500',
};

const stockDot: Record<Product['stock_status'], string> = {
  in_stock: 'bg-brand-500',
  low_stock: 'bg-orange-500',
  out_of_stock: 'bg-accent-500',
};

export function ProductCard({ product, variant }: Props) {
  const t = useTranslations();
  const locale = useLocale();
  const storeHydrated = useStoreHydrated();
  const isWholesaleAuth = useAuth((s) => !!s.wholesaleToken);
  const isWholesale = storeHydrated
    ? variant
      ? variant === 'wholesale'
      : isWholesaleAuth && !!product.wholesale_price
    : variant === 'wholesale';

  const cartItem = useCart((s) =>
    storeHydrated ? s.items.find((i) => i.product_id === product.id) : undefined
  );
  const add = useCart((s) => s.add);
  const setQty = useCart((s) => s.setQty);
  const decrement = useCart((s) => s.decrement);

  const [qty, setQtyLocal] = useState(isWholesale ? 10 : 1);
  useEffect(() => {
    if (cartItem) setQtyLocal(cartItem.qty);
  }, [cartItem]);

  const name = locale === 'es' ? product.name_es : product.name_en;
  const primary =
    product.images.find((i) => i.is_primary) || product.images[0];
  const out = product.stock_status === 'out_of_stock';

  const stockKey = product.stock_status as keyof typeof stockDot;

  const promoLabel = product.promotion_text || null;
  const localePrefix = locale === 'es' ? '' : `/${locale}`;
  const detailHref = `${localePrefix}/product/${product.id}`;

  return (
    <div className="card overflow-hidden">
      <div className="relative aspect-square bg-brand-50">
        <Link href={detailHref} className="absolute inset-0">
          {primary ? (
            <Image
              src={resolveMediaUrl(primary.url)}
              alt={primary.alt_text || name}
              fill
              sizes="(max-width: 768px) 50vw, 240px"
              className="object-cover"
            />
          ) : (
            <span className="grid h-full place-items-center text-xs text-brand-300">
              No image
            </span>
          )}
        </Link>
        <button
          aria-label="favorite"
          className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-white/90 text-brand-700 shadow-soft hover:bg-white"
        >
          <Heart className="h-4 w-4" />
        </button>
        {promoLabel && (
          <span
            className={cn(
              'absolute left-2 top-2 chip',
              isWholesale
                ? 'bg-accent-500 text-white'
                : 'bg-brand-700 text-white'
            )}
          >
            {promoLabel}
          </span>
        )}
      </div>

      <div className="p-3">
        <Link href={detailHref} className="line-clamp-1 text-sm font-semibold text-brand-900 hover:underline">
          {name}
        </Link>
        {product.pot_size && (
          <div className="text-[11px] text-brand-700/70">
            {product.pot_size}
          </div>
        )}

        {isWholesale && product.wholesale_price ? (
          <div className="mt-1.5">
            <div className="text-[10px] font-semibold uppercase tracking-wide text-brand-700">
              {t('product.wholesalePrice')}
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold text-brand-700">
                {formatPrice(product.wholesale_price)}
              </span>
              <span className="text-xs text-brand-700/50 line-through">
                {formatPrice(product.retail_price)}
              </span>
            </div>
            <div className="text-[10px] text-brand-700/60">
              {t('product.from', { n: 10 })}
            </div>
          </div>
        ) : (
          <div className="mt-1.5">
            <div className="text-base font-extrabold text-brand-700">
              {formatPrice(product.retail_price)}
            </div>
          </div>
        )}

        <div
          className={cn(
            'mt-1.5 flex items-center gap-1.5 text-[11px]',
            stockColor[stockKey]
          )}
        >
          <span className={cn('h-1.5 w-1.5 rounded-full', stockDot[stockKey])} />
          <span>{t(`product.stock.${stockKey}` as 'product.stock.in_stock')}</span>
        </div>

        <div className="mt-2.5">
          {isWholesale ? (
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center rounded-full border border-brand-200">
                <button
                  type="button"
                  onClick={() => {
                    const next = Math.max(1, qty - 1);
                    setQtyLocal(next);
                    if (cartItem) {
                      if (next < 1) decrement(product.id, qty);
                      else setQty(product.id, next);
                    }
                  }}
                  className="grid h-7 w-7 place-items-center text-brand-700"
                  aria-label="decrease"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-[1.5rem] text-center text-sm font-semibold text-brand-800">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const next = qty + 1;
                    setQtyLocal(next);
                    if (cartItem) setQty(product.id, next);
                  }}
                  className="grid h-7 w-7 place-items-center text-brand-700"
                  aria-label="increase"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <button
                type="button"
                disabled={out}
                onClick={() => add(product, qty)}
                className="btn-primary !py-1.5 !px-4 !text-xs"
              >
                {t('product.add')}
              </button>
            </div>
          ) : (
            <button
              type="button"
              disabled={out}
              onClick={() => add(product, 1)}
              className="btn-outline w-full !py-2 !text-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              {t('product.addToList')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
