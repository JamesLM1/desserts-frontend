import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { z } from 'zod'
import type { Product } from '../interfaces/product'
import type { CartItem } from '../interfaces/cart'
import { notify } from './toastStore'

export const MAX_QUANTITY = 99

const storedProduct = z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    categoryId: z.string().min(1),
    price: z.number().finite().positive().max(10_000),
    image: z.string().min(1),
    category: z.object({ id: z.string(), name: z.string() }).optional(),
})
const storedCart = z.object({
    items: z.array(z.object({
        product: storedProduct,
        quantity: z.number().int().min(1).max(MAX_QUANTITY),
    })).max(500),
})

interface CartState {
    items: CartItem[]
    add: (product: Product) => void
    decrease: (id: string) => void
    remove: (id: string) => void
    refreshProduct: (product: Product) => void
    clear: () => void
}

let storageWarningShown = false
function storageWarning() {
    if (!storageWarningShown) {
        storageWarningShown = true
        notify('Your browser cannot save the cart. It will remain available until you close this page.', 'error')
    }
}

const storage = createJSONStorage(() => ({
    getItem: (name: string) => {
        try { return localStorage.getItem(name) } catch { storageWarning(); return null }
    },
    setItem: (name: string, value: string) => {
        try { localStorage.setItem(name, value) } catch { storageWarning() }
    },
    removeItem: (name: string) => {
        try { localStorage.removeItem(name) } catch { storageWarning() }
    },
}))

export const useCartStore = create<CartState>()(persist((set) => ({
    items: [],
    add: (product) => {
        const parsed = storedProduct.safeParse(product)
        if (!parsed.success) {
            notify('This product has invalid data and cannot be added to the cart.', 'error')
            return
        }
        set((state) => {
            const existing = state.items.find((item) => item.product.id === product.id)
            return {
                items: existing
                    ? state.items.map((item) => item.product.id === product.id
                        ? { product: parsed.data, quantity: Math.min(item.quantity + 1, MAX_QUANTITY) }
                        : item)
                    : [...state.items, { product: parsed.data, quantity: 1 }],
            }
        })
    },
    decrease: (id) => set((state) => ({
        items: state.items.flatMap((item) => item.product.id !== id ? [item]
            : item.quantity > 1 ? [{ ...item, quantity: item.quantity - 1 }] : []),
    })),
    remove: (id) => set((state) => ({ items: state.items.filter((item) => item.product.id !== id) })),
    refreshProduct: (product) => set((state) => ({
        items: state.items.map((item) => item.product.id === product.id
            ? { ...item, product: { ...product, category: product.category ?? item.product.category } }
            : item),
    })),
    clear: () => set({ items: [] }),
}), {
    name: 'desserts-cart',
    version: 1,
    storage,
    partialize: (state) => ({ items: state.items }),
    merge: (persisted, current) => {
        const parsed = storedCart.safeParse(persisted)
        if (!parsed.success) return current
        const ids = new Set<string>()
        return { ...current, items: parsed.data.items.filter((item) => {
            if (ids.has(item.product.id)) return false
            ids.add(item.product.id)
            return true
        }) }
    },
}))
