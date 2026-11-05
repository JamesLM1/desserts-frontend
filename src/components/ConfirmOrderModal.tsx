import type { CartItem } from '../interfaces/cart'
import { cartTotal } from '../interfaces/cart'
import Dialog from './Dialog'
import ProductImage from './ProductImage'

interface ConfirmOrderModalProps {
    items: CartItem[] | null
    onClose: () => void
}

export default function ConfirmOrderModal({ items, onClose }: ConfirmOrderModalProps) {
    return <Dialog isOpen={items !== null} onClose={onClose} labelledBy="confirmation-title" describedBy="confirmation-description"
        className="inset-x-0 bottom-0 top-auto m-0 max-h-dvh w-full max-w-none overflow-y-auto rounded-t-xl px-6 py-10 sm:inset-0 sm:m-auto sm:max-h-[90dvh] sm:max-w-148 sm:rounded-xl sm:p-10">
        <img src="/assets/images/icon-order-confirmed.svg" alt="" className="mb-6 h-12 w-12" />
        <h2 id="confirmation-title" className="text-[40px] font-bold leading-tight">Order Confirmed</h2>
        <p id="confirmation-description" className="mt-2 text-base text-[#87635a]">We hope you enjoy your food!</p>
        <div className="my-8 rounded-lg bg-[#fcf8f6] px-6">
            <ul className="divide-y divide-[#f4edeb]">
                {(items ?? []).map(({ product, quantity }) => <li key={product.id} className="flex items-center gap-4 py-4">
                    <ProductImage src={product.image} alt="" thumbnail className="h-12 w-12 shrink-0 rounded object-cover" />
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{product.name}</p>
                        <div className="mt-2 flex gap-4 text-sm">
                            <span className="font-semibold text-[#c73a0f]">{quantity}x</span>
                            <span className="text-[#87635a]">@ ${product.price.toFixed(2)}</span>
                        </div>
                    </div>
                    <p className="shrink-0 text-sm font-semibold">${(Math.round(product.price * 100) * quantity / 100).toFixed(2)}</p>
                </li>)}
            </ul>
            <div className="flex items-center justify-between gap-4 border-t border-[#f4edeb] py-6">
                <p className="text-sm">Order Total</p><p className="text-2xl font-bold">${cartTotal(items ?? []).toFixed(2)}</p>
            </div>
        </div>
        <button type="button" onClick={onClose} className="button-primary w-full">Start New Order</button>
    </Dialog>
}
