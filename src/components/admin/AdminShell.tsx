'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Boxes, FolderTree, LayoutGrid, LogOut } from 'lucide-react';
import { useEffect } from 'react';
import { Logo } from '@/components/Logo';
import { useAuth } from '@/lib/auth-store';
import { cn } from '@/lib/format';

export function AdminShell({ children }: { children: React.ReactNode }) {
  const t = useTranslations('admin');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const adminToken = useAuth((s) => s.adminToken);
  const adminUser = useAuth((s) => s.adminUser);
  const logout = useAuth((s) => s.logoutAdmin);
  const localePrefix = locale === 'es' ? '' : `/${locale}`;

  useEffect(() => {
    if (!adminToken) {
      router.replace(`${localePrefix}/admin/login`);
    }
  }, [adminToken, router, localePrefix]);

  if (!adminToken) {
    return (
      <div className="grid min-h-screen place-items-center text-sm text-brand-700/70">
        ...
      </div>
    );
  }

  const items = [
    {
      href: `${localePrefix}/admin`,
      label: t('dashboard'),
      icon: LayoutGrid,
      match: (p: string) =>
        p === `${localePrefix}/admin` || p === `/${locale}/admin`,
    },
    {
      href: `${localePrefix}/admin/products`,
      label: t('products'),
      icon: Boxes,
      match: (p: string) => p.includes('/admin/products'),
    },
    {
      href: `${localePrefix}/admin/categories`,
      label: t('categories'),
      icon: FolderTree,
      match: (p: string) => p.includes('/admin/categories'),
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafdf8]">
      <header className="sticky top-0 z-30 border-b border-brand-100 bg-white/95 backdrop-blur">
        <div className="container-app flex items-center justify-between py-3">
          <Link href={`${localePrefix}/admin`}>
            <Logo />
          </Link>
          <div className="flex items-center gap-2">
            <span className="hidden text-xs text-brand-700/70 sm:inline">
              {adminUser?.email}
            </span>
            <button
              onClick={() => {
                logout();
                router.replace(`${localePrefix}/admin/login`);
              }}
              className="flex items-center gap-1 rounded-full border border-brand-200 px-3 py-1.5 text-xs font-semibold text-brand-700 hover:bg-brand-50"
            >
              <LogOut className="h-3.5 w-3.5" />
              {t('logout')}
            </button>
          </div>
        </div>
      </header>

      <main className="container-app pb-24 pt-3">{children}</main>

      <nav
        className="fixed inset-x-0 bottom-0 z-30 border-t border-brand-100 bg-white/95 backdrop-blur"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="container-app grid grid-cols-3 gap-1 py-2">
          {items.map(({ href, label, icon: Icon, match }) => {
            const active = match(pathname);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex flex-col items-center gap-0.5 py-1 text-[11px] font-semibold transition',
                  active ? 'text-brand-700' : 'text-brand-700/60'
                )}
              >
                <span
                  className={cn(
                    'grid h-9 w-12 place-items-center rounded-xl transition',
                    active ? 'bg-brand-50' : ''
                  )}
                >
                  <Icon className="h-5 w-5" />
                </span>
                {label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
