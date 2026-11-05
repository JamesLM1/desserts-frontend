import Dialog from './Dialog'
import CartSummary from './CartSummary'
import { useCartStore } from '../stores/cartStore'

interface CartDrawerProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
}

export default function CartDrawer({ isOpen, onClose, onConfirm }: CartDrawerProps) {
    const items = useCartStore((state) => state.items)
    return <Dialog isOpen={isOpen} onClose={onClose} labelledBy="drawer-cart-title"
        className="inset-y-0 right-0 left-auto m-0 h-dvh max-h-none w-full max-w-md overflow-y-auto p-2 sm:p-4">
        <div className="flex justify-end px-4 pt-3">
            <button type="button" onClick={onClose} className="button-secondary">Close cart</button>
        </div>
        <CartSummary items={items} onConfirm={onConfirm} headingId="drawer-cart-title" />
        <button type="button" onClick={onClose} className="button-secondary mx-6 mb-4">Continue shopping</button>
    </Dialog>
}
