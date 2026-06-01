import type { CartItem } from './types';
import { formatPrice } from './format';

const DEFAULT_PHONE = '50760000000';
const MAX_URL_LENGTH = 2048;

export function getWhatsAppPhone(): string {
  return (process.env.NEXT_PUBLIC_WHATSAPP_PHONE || DEFAULT_PHONE).replace(
    /\D/g,
    ''
  );
}

interface BuildOptions {
  locale: 'es' | 'en';
  isWholesale: boolean;
  note?: string;
  items: CartItem[];
}

export const buildOrderMessage = ({
  locale,
  isWholesale,
  note,
  items,
}: BuildOptions): string => {
  const t =
    locale === 'es'
      ? {
          greeting: 'Hola, me gustaría solicitar una cotización para los siguientes productos:',
          unit: 'unid.',
          subtotal: 'Total estimado',
          wholesaleNote: '(Modo mayorista)',
          notesLabel: 'Notas',
          empty: 'Sin productos',
        }
      : {
          greeting: 'Hello, I would like to request a quote for the following items:',
          unit: 'units',
          subtotal: 'Estimated total',
          wholesaleNote: '(Wholesale mode)',
          notesLabel: 'Notes',
          empty: 'No items',
        };

  if (!items.length) {
    return `${t.greeting}\n${t.empty}`;
  }

  const lines = items.map((i) => {
    const name = locale === 'es' ? i.name_es : i.name_en;
    const price =
      isWholesale && i.wholesale_price ? i.wholesale_price : i.retail_price;
    const sizeSuffix = i.pot_size ? ` — ${i.pot_size}` : '';
    return `• ${i.qty} ${t.unit} — ${name}${sizeSuffix} (${formatPrice(price)})`;
  });

  const total = items.reduce((sum, i) => {
    const price =
      isWholesale && i.wholesale_price ? i.wholesale_price : i.retail_price;
    return sum + price * i.qty;
  }, 0);

  const parts = [
    `${t.greeting}${isWholesale ? ` ${t.wholesaleNote}` : ''}`,
    '',
    ...lines,
    '',
    `${t.subtotal}: ${formatPrice(total)}`,
  ];

  if (note && note.trim()) {
    parts.push('', `${t.notesLabel}: ${note.trim()}`);
  }

  return parts.join('\n');
};

function buildWhatsAppUrl(phone: string, message: string): string {
  const url = new URL('https://api.whatsapp.com/send');
  url.searchParams.set('phone', phone);

  const trimmedMessage = message.trim();
  if (trimmedMessage) {
    url.searchParams.set('text', trimmedMessage);
  }

  let href = url.toString();

  if (href.length > MAX_URL_LENGTH && trimmedMessage) {
    let body = trimmedMessage;
    while (body.length > 0) {
      url.searchParams.set('text', body);
      href = url.toString();
      if (href.length <= MAX_URL_LENGTH) break;
      body = body.slice(0, Math.max(0, body.length - 40)).trimEnd();
    }

    if (href.length > MAX_URL_LENGTH) {
      url.searchParams.delete('text');
      href = url.toString();
    }
  }

  return href;
}

export const whatsappUrl = (message: string): string => {
  const phone = getWhatsAppPhone();
  if (!phone) {
    return 'https://api.whatsapp.com/';
  }

  const href = buildWhatsAppUrl(phone, message);
  if (!href.startsWith('https://')) {
    return `https://api.whatsapp.com/send?phone=${phone}`;
  }

  return href;
};

export function openWhatsApp(message: string): void {
  const href = whatsappUrl(message);
  window.open(href, '_blank', 'noopener,noreferrer');
}
