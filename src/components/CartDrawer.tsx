interface CartDrawerProps {
    isOpen: boolean
    onClose: () => void
}

function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
    if (!isOpen) {
        return null
    }

    return (
        <dialog
            ref={(dialog) => {
                if (dialog && !dialog.open) {
                    dialog.showModal()
                }
            }}
            onCancel={onClose}
            aria-labelledby="cart-title"
            className="fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-none w-full max-w-md overflow-y-auto border-0 bg-white p-6 text-[#260f08] shadow-xl backdrop:bg-black/40 sm:p-8"
        >
            <div className="flex items-center justify-between gap-4">
                <h2
                    id="cart-title"
                    className="text-2xl font-bold text-[#c73a0f]"
                >
                    Your Cart (0)
                </h2>

                <button
                    type="button"
                    onClick={onClose}
                    className="min-h-11 cursor-pointer rounded-full px-4 text-sm font-semibold text-[#87635a] transition-colors hover:bg-[#fcf8f6] hover:text-[#260f08] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c73a0f]"
                >
                    Close
                </button>
            </div>

            <div className="flex flex-col items-center gap-4 py-12">
                <img
                    src="/assets/images/illustration-empty-cart.svg"
                    alt=""
                    className="h-32 w-32"
                />

                <p className="text-center text-sm font-semibold text-[#87635a]">
                    Your added items will appear here
                </p>
            </div>

            <button
                type="button"
                onClick={onClose}
                className="min-h-12 w-full cursor-pointer rounded-full bg-[#c73a0f] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#952c0c] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c73a0f]"
            >
                Continue shopping
            </button>
        </dialog>
    )
}

export default CartDrawer