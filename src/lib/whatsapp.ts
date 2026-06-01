import type { CartItem } from './types';
import { formatPrice } from './format';

const phone = (
  process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '50760000000'
).replace(/\D/g, '');

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

export const whatsappUrl = (message: string): string => {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encoded}`;
};
