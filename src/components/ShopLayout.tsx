import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router'
import { cartCount } from '../interfaces/cart'
import type { CartItem } from '../interfaces/cart'
import { useCartStore } from '../stores/cartStore'
import CartDrawer from './CartDrawer'
import ConfirmOrderModal from './ConfirmOrderModal'

export default function ShopLayout() {
    const [isCartOpen, setIsCartOpen] = useState(false)
    const [order, setOrder] = useState<CartItem[] | null>(null)
    const items = useCartStore((state) => state.items)
    const clear = useCartStore((state) => state.clear)
    function confirmOrder() {
        if (items.length === 0) return
        setOrder(items.map((item) => ({ ...item, product: { ...item.product } })))
        clear()
        setIsCartOpen(false)
    }
    return <>
        <nav aria-label="Main navigation" className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3 px-6 pt-6 sm:px-10 xl:px-28">
            <Link to="/" className="font-bold text-[#c73a0f]">Desserts bakery</Link>
            <div className="flex flex-wrap items-center gap-3 text-sm">
                <NavLink to="/" end className={({ isActive }) => isActive ? 'font-semibold underline' : 'hover:text-[#c73a0f]'}>Shop</NavLink>
                <NavLink to="/admin/products" className={({ isActive }) => isActive ? 'font-semibold underline' : 'hover:text-[#c73a0f]'}>Manage products</NavLink>
                <button type="button" className="button-secondary" aria-haspopup="dialog" onClick={() => setIsCartOpen(true)}>Cart ({cartCount(items)})</button>
            </div>
        </nav>
        <Outlet context={{ openCart: () => setIsCartOpen(true), confirmOrder }} />
        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} onConfirm={confirmOrder} />
        <ConfirmOrderModal items={order} onClose={() => setOrder(null)} />
    </>
}
