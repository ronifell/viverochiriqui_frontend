import { setRequestLocale } from 'next-intl/server';
import { isLocale } from '@/i18n/config';
import { notFound } from 'next/navigation';
import { WholesaleLoginView } from '@/views/WholesaleLoginView';

interface Props {
  params: { locale: string };
}

export default function WholesaleLoginPage({ params }: Props) {
  if (!isLocale(params.locale)) notFound();
  setRequestLocale(params.locale);
  return <WholesaleLoginView />;
}
