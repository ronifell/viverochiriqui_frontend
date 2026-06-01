export const formatPrice = (value: number, locale: string = 'es-PA'): string => {
  if (Number.isNaN(value)) return '$0.00';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const cn = (...args: (string | undefined | false | null)[]) =>
  args.filter(Boolean).join(' ');
