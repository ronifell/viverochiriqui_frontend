'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Crown, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/lib/auth-store';
import { Logo } from './Logo';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Header() {
  const t = useTranslations();
  const locale = useLocale();
  const wholesale = useAuth((s) => !!s.wholesaleToken);
  const logoutWholesale = useAuth((s) => s.logoutWholesale);
  const [open, setOpen] = useState(false);

  const localePrefix = locale === 'es' ? '' : `/${locale}`;

  return (
    <header className="sticky top-0 z-30 border-b border-brand-100 bg-white/90 backdrop-blur">
      <div className="container-app flex items-center justify-between py-3">
        <button
          type="button"
          aria-label="Menu"
          onClick={() => setOpen(true)}
          className="rounded-full p-2 text-brand-700 hover:bg-brand-50"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link href={`${localePrefix}/`}>
          <Logo />
        </Link>
        {wholesale ? (
          <div className="flex flex-col items-end leading-tight">
            <div className="flex items-center gap-1 rounded-xl bg-brand-700 px-3 py-1.5 text-white">
              <Crown className="h-4 w-4" />
              <div className="text-xs font-semibold">
                {t('home.wholesaleBadge')}
              </div>
            </div>
            <span className="mt-0.5 text-[10px] text-brand-700/80">
              {t('home.wholesaleBadgeActive')}
            </span>
            <button
              onClick={logoutWholesale}
              className="text-[10px] text-brand-600 underline"
            >
              {t('home.wholesaleLogout')}
            </button>
          </div>
        ) : (
          <Link
            href={`${localePrefix}/wholesale/login`}
            className="rounded-xl bg-brand-700 px-3 py-2 text-xs font-semibold leading-tight text-white shadow-soft"
          >
            <div className="flex items-center gap-1">
              <Crown className="h-4 w-4" />
              <span>{t('home.wholesaleBadge')}</span>
            </div>
            <span className="mt-0.5 block text-[10px] font-normal text-white/80">
              {t('home.wholesaleBadgeSub')}
            </span>
          </Link>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-40 bg-brand-900/40 backdrop-blur-sm">
          <div className="absolute left-0 top-0 h-full w-72 max-w-[85%] overflow-y-auto bg-white p-5 shadow-2xl">
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
          <button
            aria-label="Close"
            className="absolute inset-0 -z-10 h-full w-full"
            onClick={() => setOpen(false)}
          />
        </div>
      )}
    </header>
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
