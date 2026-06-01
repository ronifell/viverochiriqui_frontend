'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Home, Grid2x2, ClipboardList, MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useCart } from '@/lib/cart-store';
import { cn } from '@/lib/format';

export function BottomNav() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const totalItems = useCart((s) => s.totalItems());

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const localePrefix = locale === 'es' ? '' : `/${locale}`;
  const items = [
    {
      href: `${localePrefix}/`,
      label: t('home'),
      icon: Home,
      match: (p: string) =>
        p === '/' ||
        p === `/${locale}` ||
        p === `/${locale}/`,
    },
    {
      href: `${localePrefix}/catalog`,
      label: t('categories'),
      icon: Grid2x2,
      match: (p: string) => p.includes('/catalog'),
    },
    {
      href: `${localePrefix}/list`,
      label: t('list'),
      icon: ClipboardList,
      badge: mounted ? totalItems : 0,
      match: (p: string) => p.includes('/list'),
    },
    {
      href: `${localePrefix}/contact`,
      label: t('contact'),
      icon: MessageCircle,
      match: (p: string) => p.includes('/contact'),
    },
  ];

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-brand-100 bg-white/95 backdrop-blur lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="container-app grid grid-cols-4 gap-1 py-2">
        {items.map(({ href, label, icon: Icon, match, badge }) => {
          const active = match(pathname);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'relative flex flex-col items-center justify-center rounded-xl py-1.5 text-[11px] font-medium transition',
                active
                  ? 'text-brand-700'
                  : 'text-brand-700/60 hover:text-brand-700'
              )}
            >
              <span
                className={cn(
                  'relative grid h-9 w-12 place-items-center rounded-xl transition',
                  active ? 'bg-brand-50' : ''
                )}
              >
                <Icon className="h-5 w-5" />
                {!!badge && badge > 0 && (
                  <span className="absolute -top-0.5 right-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-accent-500 px-1 text-[10px] font-bold leading-none text-white">
                    {badge}
                  </span>
                )}
              </span>
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
