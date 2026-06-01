import { Suspense } from 'react';
import { setRequestLocale } from 'next-intl/server';
import { isLocale } from '@/i18n/config';
import { notFound } from 'next/navigation';
import { CatalogView } from '@/views/CatalogView';
import { CatalogSkeleton } from '@/components/CatalogSkeleton';

interface Props {
  params: { locale: string };
}

export const dynamic = 'force-dynamic';

export default function CatalogPage({ params }: Props) {
  if (!isLocale(params.locale)) notFound();
  setRequestLocale(params.locale);
  return (
    <Suspense fallback={<CatalogSkeleton />}>
      <CatalogView />
    </Suspense>
  );
}
