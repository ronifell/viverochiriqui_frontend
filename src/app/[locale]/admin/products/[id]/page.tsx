import { setRequestLocale } from 'next-intl/server';
import { isLocale } from '@/i18n/config';
import { notFound } from 'next/navigation';
import { AdminProductForm } from '@/views/admin/AdminProductForm';

interface Props {
  params: { locale: string; id: string };
}

export const dynamic = 'force-dynamic';

export default function EditProductPage({ params }: Props) {
  if (!isLocale(params.locale)) notFound();
  setRequestLocale(params.locale);
  return <AdminProductForm productId={params.id} />;
}
