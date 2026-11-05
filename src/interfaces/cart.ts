import type { Product } from './product'

export interface CartItem {
    product: Product
    quantity: number
}

export function cartCount(items: CartItem[]) {
    return items.reduce((count, item) => count + item.quantity, 0)
}

export function cartTotal(items: CartItem[]) {
    return items.reduce((cents, item) => cents + Math.round(item.product.price * 100) * item.quantity, 0) / 100
}
