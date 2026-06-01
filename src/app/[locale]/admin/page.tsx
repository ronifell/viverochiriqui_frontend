import { setRequestLocale } from 'next-intl/server';
import { isLocale } from '@/i18n/config';
import { notFound } from 'next/navigation';
import { AdminDashboardView } from '@/views/admin/AdminDashboardView';

interface Props {
  params: { locale: string };
}

export const dynamic = 'force-dynamic';

export default function AdminPage({ params }: Props) {
  if (!isLocale(params.locale)) notFound();
  setRequestLocale(params.locale);
  return <AdminDashboardView />;
}
