'use client';

import { ArrowLeft, Lock, Mail, Shield } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { FormEvent, useState } from 'react';
import { Logo } from '@/components/Logo';
import { api, ApiError } from '@/lib/api';
import { useAuth } from '@/lib/auth-store';

export function AdminLoginView() {
  const t = useTranslations('admin');
  const locale = useLocale();
  const router = useRouter();
  const setAdmin = useAuth((s) => s.setAdmin);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const localePrefix = locale === 'es' ? '' : `/${locale}`;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.adminLogin(email, password);
      setAdmin(res.token, res.user);
      router.push(`${localePrefix}/admin`);
    } catch (e) {
      if (e instanceof ApiError) {
        setError(t('invalid'));
      } else {
        setError(t('invalid'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-50 px-4 py-8">
      <div className="mx-auto w-full max-w-sm">
        <Link
          href={`${localePrefix}/`}
          className="mb-6 inline-flex items-center gap-1 text-xs font-semibold text-brand-700"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('logout')}
        </Link>

        <div className="rounded-3xl bg-white p-6 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <Logo />
            <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-700 text-white">
              <Shield className="h-5 w-5" />
            </span>
          </div>
          <h1 className="font-display text-2xl font-extrabold text-brand-900">
            {t('loginTitle')}
          </h1>

          <form onSubmit={onSubmit} className="mt-5 space-y-3">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-brand-800">
                {t('email')}
              </span>
              <div className="flex items-center gap-2 rounded-xl border border-brand-200 bg-white px-3 focus-within:border-brand-500">
                <Mail className="h-4 w-4 text-brand-700/60" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  className="w-full bg-transparent py-3 text-sm text-brand-900 outline-none"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-brand-800">
                {t('password')}
              </span>
              <div className="flex items-center gap-2 rounded-xl border border-brand-200 bg-white px-3 focus-within:border-brand-500">
                <Lock className="h-4 w-4 text-brand-700/60" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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
              {loading ? t('saving') : t('submit')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
