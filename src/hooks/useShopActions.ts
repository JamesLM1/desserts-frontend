import { useOutletContext } from 'react-router'

export interface ShopActions {
    openCart: () => void
    confirmOrder: () => void
}

export function useShopActions() {
    return useOutletContext<ShopActions>()
}
