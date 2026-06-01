'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import {
  Apple,
  Cherry,
  Flower2,
  Leaf,
  PackageOpen,
  Sprout,
  Sun,
  Tag,
  TreeDeciduous,
  TreePine,
} from 'lucide-react';
import { cn } from '@/lib/format';
import type { Category } from '@/lib/types';

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  flower: Flower2,
  leaf: Leaf,
  sun: Sun,
  tree: TreeDeciduous,
  pine: TreePine,
  apple: Apple,
  succulent: Sprout,
  cactus: Cherry, // visually close enough; swap for a custom svg if available
  pot: PackageOpen,
  soil: PackageOpen,
  tag: Tag,
};

interface Props {
  categories: Category[];
  activeSlug?: string | null;
}

export function CategoryStrip({ categories, activeSlug }: Props) {
  const locale = useLocale();
  const localePrefix = locale === 'es' ? '' : `/${locale}`;
  return (
    <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-1 pt-2">
      {categories.map((c) => {
        const Icon = (c.icon && ICONS[c.icon]) || Leaf;
        const label = locale === 'es' ? c.name_es : c.name_en;
        const active = activeSlug === c.slug;
        return (
          <Link
            key={c.id}
            href={`${localePrefix}/catalog?category=${c.slug}`}
            className={cn(
              'group flex w-16 shrink-0 flex-col items-center gap-1 text-center',
              active ? 'text-brand-700' : 'text-brand-800'
            )}
          >
            <span
              className={cn(
                'grid h-12 w-12 place-items-center rounded-2xl border transition',
                active
                  ? 'border-brand-600 bg-brand-50'
                  : 'border-brand-100 bg-white group-hover:bg-brand-50'
              )}
            >
              <Icon className="h-5 w-5 text-brand-700" />
            </span>
            <span className="line-clamp-2 text-[10px] font-medium leading-tight">
              {label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
