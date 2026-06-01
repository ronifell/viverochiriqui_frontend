'use client';

import { ArrowLeft, Crown, Lock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { FormEvent, useState } from 'react';
import { Logo } from '@/components/Logo';
import { api, ApiError } from '@/lib/api';
import { useAuth } from '@/lib/auth-store';

export function WholesaleLoginView() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const setWholesale = useAuth((s) => s.setWholesale);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.wholesaleLogin(password);
      setWholesale(res.token);
      const localePrefix = locale === 'es' ? '' : `/${locale}`;
      router.push(`${localePrefix}/`);
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        setError(t('wholesale.invalid'));
      } else {
        setError(t('wholesale.invalid'));
      }
    } finally {
      setLoading(false);
    }
  };

  const localePrefix = locale === 'es' ? '' : `/${locale}`;

  return (
    <div className="min-h-screen bg-brand-50 px-4 py-8">
      <div className="mx-auto w-full max-w-sm">
        <Link
          href={`${localePrefix}/`}
          className="mb-6 inline-flex items-center gap-1 text-xs font-semibold text-brand-700"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('wholesale.back')}
        </Link>

        <div className="rounded-3xl bg-white p-6 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <Logo />
            <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-50 text-brand-700">
              <Crown className="h-5 w-5" />
            </span>
          </div>
          <h1 className="font-display text-2xl font-extrabold text-brand-900">
            {t('wholesale.title')}
          </h1>
          <p className="mt-1 text-sm text-brand-700/80">
            {t('wholesale.desc')}
          </p>

          <form onSubmit={onSubmit} className="mt-5 space-y-3">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-brand-800">
                {t('wholesale.passwordLabel')}
              </span>
              <div className="flex items-center gap-2 rounded-xl border border-brand-200 bg-white px-3 focus-within:border-brand-500">
                <Lock className="h-4 w-4 text-brand-700/60" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoFocus
                  className="w-full bg-transparent py-3 text-sm text-brand-900 outline-none"
                />
              </div>
            </label>

            {error && (
              <div className="rounded-xl bg-accent-50 p-2 text-xs font-semibold text-accent-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full !py-3"
            >
              {loading ? t('common.loading') : t('wholesale.submit')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
