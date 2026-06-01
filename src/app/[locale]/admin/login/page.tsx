import { setRequestLocale } from 'next-intl/server';
import { isLocale } from '@/i18n/config';
import { notFound } from 'next/navigation';
import { AdminLoginView } from '@/views/admin/AdminLoginView';

interface Props {
  params: { locale: string };
}

export default function AdminLoginPage({ params }: Props) {
  if (!isLocale(params.locale)) notFound();
  setRequestLocale(params.locale);
  return <AdminLoginView />;
}
