import type { CartItem } from '../interfaces/cart'
import { cartCount, cartTotal } from '../interfaces/cart'
import { MAX_QUANTITY, useCartStore } from '../stores/cartStore'
import QuantityStepper from './QuantityStepper'

interface CartSummaryProps {
    items: CartItem[]
    onConfirm: () => void
    onOpenDrawer?: () => void
    headingId?: string
}

export default function CartSummary({ items, onConfirm, onOpenDrawer, headingId = 'cart-title' }: CartSummaryProps) {
    const add = useCartStore((state) => state.add)
    const decrease = useCartStore((state) => state.decrease)
    const remove = useCartStore((state) => state.remove)
    return <aside aria-labelledby={headingId} className="rounded-xl bg-white p-6">
        <h2 id={headingId} className="text-2xl font-bold text-[#c73a0f]">Your Cart ({cartCount(items)})</h2>
        {onOpenDrawer && <button type="button" onClick={onOpenDrawer} className="mt-2 text-sm text-[#87635a] underline hover:text-[#c73a0f]">Open cart drawer</button>}
        {items.length === 0 ? <div className="pb-4 pt-6 text-center">
            <img src="/assets/images/illustration-empty-cart.svg" alt="" className="mx-auto h-32 w-32" />
            <p className="mt-4 text-sm font-semibold text-[#87635a]">Your added items will appear here</p>
        </div> : <>
            <ul className="mt-2 divide-y divide-[#f4edeb]">
                {items.map(({ product, quantity }) => <li key={product.id} className="flex items-start gap-3 py-4">
                    <div className="min-w-0 flex-1">
                        <h3 className="truncate text-sm font-semibold">{product.name}</h3>
                        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm">
                            <span className="font-semibold text-[#c73a0f]">{quantity}x</span>
                            <span className="text-[#87635a]">@ ${product.price.toFixed(2)}</span>
                            <span className="font-semibold text-[#87635a]">${(Math.round(product.price * 100) * quantity / 100).toFixed(2)}</span>
                        </div>
                        <div className="mt-3">
                            <QuantityStepper quantity={quantity} productName={product.name}
                                onDecrease={() => decrease(product.id)}
                                onIncrease={quantity < MAX_QUANTITY ? () => add(product) : undefined} />
                        </div>
                    </div>
                    <button type="button" onClick={() => remove(product.id)} aria-label={'Remove ' + product.name + ' from cart'}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#ad8985] hover:border-[#260f08]">
                        <img src="/assets/images/icon-remove-item.svg" alt="" className="h-2.5 w-2.5" />
                    </button>
                </li>)}
            </ul>
            <div className="flex items-center justify-between border-t border-[#f4edeb] py-6">
                <p className="text-sm">Order Total</p><p className="text-2xl font-bold">${cartTotal(items).toFixed(2)}</p>
            </div>
            <div className="flex items-center justify-center gap-2 rounded-lg bg-[#fcf8f6] px-3 py-4">
                <img src="/assets/images/icon-carbon-neutral.svg" alt="" className="h-5 w-5 shrink-0" />
                <p className="text-sm">This is a <span className="font-semibold">carbon-neutral</span> delivery</p>
            </div>
            <button type="button" onClick={onConfirm} aria-haspopup="dialog" className="button-primary mt-6 w-full">Confirm Order</button>
        </>}
    </aside>
}
