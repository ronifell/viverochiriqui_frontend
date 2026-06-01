'use client';

import { useEffect, useState } from 'react';
import { openWhatsApp, whatsappUrl } from '@/lib/whatsapp';

interface Props {
  message: string;
  className?: string;
  children: React.ReactNode;
}

const PLACEHOLDER_HREF = 'https://api.whatsapp.com/';

export function WhatsAppLink({ message, className, children }: Props) {
  const [href, setHref] = useState(PLACEHOLDER_HREF);

  useEffect(() => {
    setHref(whatsappUrl(message));
  }, [message]);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={(e) => {
        e.preventDefault();
        openWhatsApp(message);
      }}
    >
      {children}
    </a>
  );
}
