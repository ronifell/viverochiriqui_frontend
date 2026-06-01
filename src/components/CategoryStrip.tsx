'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Leaf } from 'lucide-react';
import { getCategoryIcon } from '@/lib/category-icons';
import { cn } from '@/lib/format';
import type { Category } from '@/lib/types';

interface Props {
  categories: Category[];
  activeSlug?: string | null;
}

export function CategoryStrip({ categories, activeSlug }: Props) {
  const locale = useLocale();
  const localePrefix = locale === 'es' ? '' : `/${locale}`;

  return (
    <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-1 pt-2 lg:mx-0 lg:flex-wrap lg:justify-start lg:gap-4 lg:overflow-visible lg:px-0">
      {categories.map((c) => {
        const Icon = getCategoryIcon(c.icon);
        const label = locale === 'es' ? c.name_es : c.name_en;
        const active = activeSlug === c.slug;
        return (
          <Link
            key={c.id}
            href={`${localePrefix}/catalog?category=${c.slug}`}
            className={cn(
              'group flex w-16 shrink-0 flex-col items-center gap-1 text-center lg:w-20',
              active ? 'text-brand-700' : 'text-brand-800'
            )}
          >
            <span
              className={cn(
                'grid h-12 w-12 place-items-center rounded-2xl border transition lg:h-14 lg:w-14',
                active
                  ? 'border-brand-600 bg-brand-50'
                  : 'border-brand-100 bg-white group-hover:bg-brand-50'
              )}
            >
              <Icon className="h-5 w-5 text-brand-700 lg:h-6 lg:w-6" />
            </span>
            <span className="line-clamp-2 text-[10px] font-medium leading-tight lg:text-xs">
              {label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

export function CategorySidebar({ categories, activeSlug }: Props) {
  const locale = useLocale();
  const localePrefix = locale === 'es' ? '' : `/${locale}`;

  return (
    <nav className="space-y-1">
      <Link
        href={`${localePrefix}/catalog`}
        className={cn(
          'flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition',
          !activeSlug
            ? 'bg-brand-50 text-brand-700'
            : 'text-brand-800 hover:bg-brand-50'
        )}
      >
        <Leaf className="h-4 w-4 shrink-0" />
        {locale === 'es' ? 'Todas' : 'All'}
      </Link>
      {categories.map((c) => {
        const Icon = getCategoryIcon(c.icon);
        const label = locale === 'es' ? c.name_es : c.name_en;
        const active = activeSlug === c.slug;
        return (
          <Link
            key={c.id}
            href={`${localePrefix}/catalog?category=${c.slug}`}
            className={cn(
              'flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition',
              active
                ? 'bg-brand-50 text-brand-700'
                : 'text-brand-800 hover:bg-brand-50'
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
