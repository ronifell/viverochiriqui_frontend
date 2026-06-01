'use client';

import { useEffect, useState } from 'react';
import { useAuth } from './auth-store';
import { useCart } from './cart-store';

function storesReady() {
  return useCart.persist.hasHydrated() && useAuth.persist.hasHydrated();
}

export function useStoreHydrated() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const sync = () => {
      if (storesReady()) setHydrated(true);
    };

    sync();

    const unsubCart = useCart.persist.onFinishHydration(sync);
    const unsubAuth = useAuth.persist.onFinishHydration(sync);

    return () => {
      unsubCart();
      unsubAuth();
    };
  }, []);

  return hydrated;
}
