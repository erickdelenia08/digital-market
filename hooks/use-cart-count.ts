// hooks/useCartCount.ts
'use client'

import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useCartStore } from '@/store/useCartStore';
import { getCartCountAction } from '@/app/actions/cart'

export function useCartCount() {
    const { status } = useSession();
    const localCart = useCartStore((state) => state.cart);
    const hasHydrated = useCartStore((state) => state._hasHydrated);

    const { data: dbCount } = useQuery({
        queryKey: ['cart', 'count'],
        queryFn: getCartCountAction,
        enabled: status === 'authenticated',
    });

    if (status === 'authenticated') {
        return dbCount ?? 0;
    }

    return !hasHydrated ? 0 : localCart.length;
}