'use client';

import { Search } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

interface Props {
  initialValue?: string;
}

export function SearchBar({ initialValue = '' }: Props) {
  const t = useTranslations('home');
  const router = useRouter();
  const locale = useLocale();
  const [value, setValue] = useState(initialValue);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const localePrefix = locale === 'es' ? '' : `/${locale}`;
    const q = value.trim();
    router.push(`${localePrefix}/catalog${q ? `?q=${encodeURIComponent(q)}` : ''}`);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="relative flex items-center rounded-2xl bg-white shadow-soft ring-1 ring-brand-100"
    >
      <Search className="ml-3 h-4 w-4 text-brand-700/60" />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={t('searchPlaceholder')}
        className="w-full rounded-2xl bg-transparent px-3 py-3 text-sm text-brand-900 outline-none placeholder:text-brand-700/50"
      />
    </form>
  );
}
