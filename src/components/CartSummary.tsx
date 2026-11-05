import type { Product } from '../data/products'

interface CartSummaryProps {
    items: {
        product: Product
        quantity: number
    }[]
    onConfirm: () => void
}

function CartSummary({ items, onConfirm }: CartSummaryProps) {
    const count = items.reduce(
        (total, item) => total + item.quantity,
        0,
    )

    const total = items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0,
    )

    return (
        <aside
            aria-labelledby="cart-title"
            className="rounded-xl bg-white p-6"
        >
            <h2
                id="cart-title"
                className="text-2xl font-bold text-[#c73a0f]"
            >
                Your Cart ({count})
            </h2>

            {items.length === 0 ? (
                <div className="pb-4 pt-6 text-center">
                    <img
                        src="/assets/images/illustration-empty-cart.svg"
                        alt=""
                        className="mx-auto h-32 w-32"
                    />

                    <p className="mt-4 text-sm font-semibold text-[#87635a]">
                        Your added items will appear here
                    </p>
                </div>
            ) : (
                <>
                    <ul className="mt-2 divide-y divide-[#f4edeb]">
                        {items.map(({ product, quantity }) => (
                            <li
                                key={product.id}
                                className="flex items-center gap-4 py-4"
                            >
                                <div className="min-w-0 flex-1">
                                    <h3 className="truncate text-sm font-semibold">
                                        {product.name}
                                    </h3>

                                    <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm">
                                        <span className="font-semibold text-[#c73a0f]">
                                            {quantity}x
                                        </span>

                                        <span className="text-[#87635a]">
                                            @ ${product.price.toFixed(2)}
                                        </span>

                                        <span className="font-semibold text-[#87635a]">
                                            ${(product.price * quantity).toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    disabled
                                    aria-label={`Remove ${product.name} from cart`}
                                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#ad8985]"
                                >
                                    <img
                                        src="/assets/images/icon-remove-item.svg"
                                        alt=""
                                        className="h-2.5 w-2.5"
                                    />
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div className="flex items-center justify-between border-t border-[#f4edeb] py-6">
                        <p className="text-sm">Order Total</p>

                        <p className="text-2xl font-bold">
                            ${total.toFixed(2)}
                        </p>
                    </div>

                    <div className="flex items-center justify-center gap-2 rounded-lg bg-[#fcf8f6] px-3 py-4">
                        <img
                            src="/assets/images/icon-carbon-neutral.svg"
                            alt=""
                            className="h-5 w-5 shrink-0"
                        />

                        <p className="text-sm">
                            This is a{' '}
                            <span className="font-semibold">carbon-neutral</span>
                            {' '}delivery
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onConfirm}
                        aria-haspopup="dialog"
                        className="mt-6 min-h-13 w-full cursor-pointer rounded-full bg-[#c73a0f] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#952c0c] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c73a0f]"
                    >
                        Confirm Order
                    </button>
                </>
            )}
        </aside>
    )
}

export default CartSummary