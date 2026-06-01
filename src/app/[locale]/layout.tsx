import type { Metadata, Viewport } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { Inter } from 'next/font/google';
import { notFound } from 'next/navigation';
import { isLocale, locales } from '@/i18n/config';
import '../globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Vivero Chiriquí — Catálogo Digital',
    template: '%s — Vivero Chiriquí',
  },
  description:
    'Catálogo digital de Vivero Chiriquí: plantas, macetas y accesorios para tu hogar y jardín. Pide por WhatsApp en segundos.',
  applicationName: 'Vivero Chiriquí',
  keywords: ['vivero', 'plantas', 'jardín', 'Chiriquí', 'Panamá', 'WhatsApp'],
  openGraph: {
    title: 'Vivero Chiriquí — Catálogo Digital',
    description:
      'Plantas que llenan tu vida de naturaleza. Cotiza vía WhatsApp en segundos.',
    type: 'website',
  },
  icons: {
    icon: '/favicon.svg',
  },
};

export const viewport: Viewport = {
  themeColor: '#216321',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={inter.variable}>
      <body className="min-h-screen font-sans">
        <NextIntlClientProvider key={locale} locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
