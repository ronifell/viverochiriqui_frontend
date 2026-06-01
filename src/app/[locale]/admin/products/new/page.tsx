import { setRequestLocale } from 'next-intl/server';
import { isLocale } from '@/i18n/config';
import { notFound } from 'next/navigation';
import { AdminProductForm } from '@/views/admin/AdminProductForm';

interface Props {
  params: { locale: string };
}

export default function NewProductPage({ params }: Props) {
  if (!isLocale(params.locale)) notFound();
  setRequestLocale(params.locale);
  return <AdminProductForm productId={null} />;
}
