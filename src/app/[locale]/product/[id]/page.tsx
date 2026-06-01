import { setRequestLocale } from 'next-intl/server';
import { isLocale } from '@/i18n/config';
import { notFound } from 'next/navigation';
import { ProductView } from '@/views/ProductView';

interface Props {
  params: { locale: string; id: string };
}

export const dynamic = 'force-dynamic';

export default function ProductPage({ params }: Props) {
  if (!isLocale(params.locale)) notFound();
  setRequestLocale(params.locale);
  return <ProductView productId={params.id} />;
}
