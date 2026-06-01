'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { Crown, LogOut, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-store';
import { cn } from '@/lib/format';
import { useStoreHydrated } from '@/lib/use-store-hydrated';
import { Logo } from './Logo';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Header() {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const wholesaleToken = useAuth((s) => s.wholesaleToken);
  const logoutWholesale = useAuth((s) => s.logoutWholesale);
  const storeHydrated = useStoreHydrated();
  const wholesale = storeHydrated && !!wholesaleToken;
  const [open, setOpen] = useState(false);

  const localePrefix = locale === 'es' ? '' : `/${locale}`;

  const navItems = [
    { href: `${localePrefix}/`, label: t('nav.home'), match: (p: string) => p === '/' || p === `/${locale}` || p === `/${locale}/` },
    { href: `${localePrefix}/catalog`, label: t('nav.categories'), match: (p: string) => p.includes('/catalog') },
    { href: `${localePrefix}/list`, label: t('nav.list'), match: (p: string) => p.includes('/list') },
    { href: `${localePrefix}/contact`, label: t('nav.contact'), match: (p: string) => p.includes('/contact') },
  ];

  const extraNavItems = [
    ...(wholesale
      ? []
      : [{
          href: `${localePrefix}/wholesale/login`,
          label: t('nav.wholesale'),
          match: (p: string) => p.includes('/wholesale'),
        }]),
    {
      href: `${localePrefix}/admin`,
      label: t('nav.admin'),
      match: (p: string) => p.includes('/admin'),
    },
  ];

  const desktopNavItems = [...navItems, ...extraNavItems];

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const wholesaleAction = wholesale ? (
    <div className="flex flex-col items-end leading-tight lg:flex-row lg:items-center lg:gap-2">
      <div className="flex items-center gap-1 rounded-xl bg-brand-700 px-3 py-1.5 text-white">
        <Crown className="h-4 w-4" />
        <div className="text-xs font-semibold">{t('home.wholesaleBadge')}</div>
      </div>
      <span className="mt-0.5 text-[10px] text-brand-700/80 lg:hidden">
        {t('home.wholesaleBadgeActive')}
      </span>
      <button
        onClick={logoutWholesale}
        className="text-[10px] text-brand-600 underline lg:text-xs"
      >
        {t('home.wholesaleLogout')}
      </button>
    </div>
  ) : (
    <Link
      href={`${localePrefix}/wholesale/login`}
      className="rounded-xl bg-brand-700 px-3 py-2 text-xs font-semibold leading-tight text-white shadow-soft lg:px-4 lg:py-2.5"
    >
      <div className="flex items-center gap-1">
        <Crown className="h-4 w-4" />
        <span>{t('home.wholesaleBadge')}</span>
      </div>
      <span className="mt-0.5 block text-[10px] font-normal text-white/80 lg:hidden">
        {t('home.wholesaleBadgeSub')}
      </span>
    </Link>
  );

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-brand-100 bg-white/90 backdrop-blur">
        <div className="container-app py-3 lg:py-4">
          {/* Mobile: menu | centered logo | wholesale */}
          <div className="relative flex items-center justify-between lg:hidden">
            <button
              type="button"
              aria-label="Menu"
              onClick={() => setOpen(true)}
              className="rounded-full p-2 text-brand-700 hover:bg-brand-50"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link
              href={`${localePrefix}/`}
              className="absolute left-1/2 -translate-x-1/2"
            >
              <Logo />
            </Link>
            {wholesaleAction}
          </div>

          {/* Desktop: logo + nav | language + wholesale */}
          <div className="hidden items-center justify-between gap-4 lg:flex">
            <div className="flex items-center gap-6">
              <Link href={`${localePrefix}/`} className="shrink-0">
                <Logo />
              </Link>
              <nav className="flex flex-wrap items-center gap-1">
                {desktopNavItems.map(({ href, label, match }) => {
                  const active = match(pathname);
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={cn(
                        'rounded-xl px-3 py-2 text-sm font-medium transition',
                        active
                          ? 'bg-brand-50 text-brand-700'
                          : 'text-brand-800 hover:bg-brand-50 hover:text-brand-700'
                      )}
                    >
                      {label}
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <LanguageSwitcher />
              {wholesaleAction}
            </div>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-brand-900/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-10 flex h-full w-72 max-w-[85%] flex-col overflow-y-auto bg-white p-5 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <Logo />
              <button
                type="button"
                aria-label="Close"
                onClick={() => setOpen(false)}
                className="rounded-full p-2 text-brand-700 hover:bg-brand-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="space-y-1 text-sm font-medium text-brand-800">
              <NavLink href={`${localePrefix}/`} onClick={() => setOpen(false)}>
                {t('nav.home')}
              </NavLink>
              <NavLink
                href={`${localePrefix}/catalog`}
                onClick={() => setOpen(false)}
              >
                {t('nav.categories')}
              </NavLink>
              <NavLink
                href={`${localePrefix}/list`}
                onClick={() => setOpen(false)}
              >
                {t('nav.list')}
              </NavLink>
              <NavLink
                href={`${localePrefix}/contact`}
                onClick={() => setOpen(false)}
              >
                {t('nav.contact')}
              </NavLink>
              {wholesale ? (
                <button
                  className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left hover:bg-brand-50"
                  onClick={() => {
                    logoutWholesale();
                    setOpen(false);
                  }}
                >
                  <span>{t('wholesale.logout')}</span>
                  <LogOut className="h-4 w-4" />
                </button>
              ) : (
                <NavLink
                  href={`${localePrefix}/wholesale/login`}
                  onClick={() => setOpen(false)}
                >
                  {t('nav.wholesale')}
                </NavLink>
              )}
              <NavLink
                href={`${localePrefix}/admin`}
                onClick={() => setOpen(false)}
              >
                {t('nav.admin')}
              </NavLink>
            </nav>
            <div className="mt-6 border-t border-brand-100 pt-4">
              <div className="mb-2 text-xs font-medium text-brand-600">
                {t('common.language')}
              </div>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function NavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block rounded-xl px-3 py-3 hover:bg-brand-50"
    >
      {children}
    </Link>
  );
}
