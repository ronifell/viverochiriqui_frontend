import { Suspense } from 'react';
import { setRequestLocale } from 'next-intl/server';
import { isLocale } from '@/i18n/config';
import { notFound } from 'next/navigation';
import { ListView } from '@/views/ListView';
import { PublicShell } from '@/components/PublicShell';

interface Props {
  params: { locale: string };
}

export const dynamic = 'force-dynamic';

export default function ListPage({ params }: Props) {
  if (!isLocale(params.locale)) notFound();
  setRequestLocale(params.locale);
  return (
    <Suspense
      fallback={
        <PublicShell>
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-40 rounded-xl bg-brand-50" />
            <div className="h-24 rounded-2xl bg-brand-50" />
            <div className="h-32 rounded-2xl bg-brand-50" />
          </div>
        </PublicShell>
      }
    >
      <ListView />
    </Suspense>
  );
}
