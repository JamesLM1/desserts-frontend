interface ConfirmOrderModalProps {
    isOpen: boolean
    onClose: () => void
}

const sampleItems = [
    {
        name: 'Waffle with Berries',
        quantity: 1,
        price: 6.5,
        image: '/assets/images/image-waffle-thumbnail.jpg',
    },
    {
        name: 'Classic Tiramisu',
        quantity: 1,
        price: 5.5,
        image: '/assets/images/image-tiramisu-thumbnail.jpg',
    },
    {
        name: 'Vanilla Panna Cotta',
        quantity: 2,
        price: 6.5,
        image: '/assets/images/image-panna-cotta-thumbnail.jpg',
    },
]

const sampleTotal = sampleItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
)

function ConfirmOrderModal({
    isOpen,
    onClose,
}: ConfirmOrderModalProps) {
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
            aria-labelledby="confirmation-title"
            aria-describedby="confirmation-description"
            className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-148 overflow-y-auto rounded-xl border-0 bg-white p-6 text-[#260f08] shadow-xl backdrop:bg-black/40 sm:p-10"
        >
            <img
                src="/assets/images/icon-order-confirmed.svg"
                alt=""
                className="mb-6 h-12 w-12"
            />

            <h2
                id="confirmation-title"
                className="text-4xl font-bold leading-tight"
            >
                Order Confirmed
            </h2>

            <p
                id="confirmation-description"
                className="mt-2 text-[#87635a]"
            >
                We hope you enjoy your food!
            </p>

            <div className="my-8 rounded-lg bg-[#fcf8f6] px-6">
                <ul className="divide-y divide-[#f4edeb]">
                    {sampleItems.map((item) => (
                        <li
                            key={item.name}
                            className="flex items-center gap-3 py-4"
                        >
                            <img
                                src={item.image}
                                alt=""
                                className="h-12 w-12 shrink-0 rounded object-cover"
                            />

                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold">
                                    {item.name}
                                </p>

                                <div className="mt-2 flex gap-4 text-sm">
                                    <span className="font-semibold text-[#c73a0f]">
                                        {item.quantity}x
                                    </span>

                                    <span className="text-[#87635a]">
                                        @ ${item.price.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <p className="shrink-0 text-sm font-semibold">
                                ${(item.price * item.quantity).toFixed(2)}
                            </p>
                        </li>
                    ))}
                </ul>

                <div className="flex items-center justify-between gap-4 border-t border-[#f4edeb] py-6">
                    <p className="text-sm">Order Total</p>

                    <p className="text-2xl font-bold">
                        ${sampleTotal.toFixed(2)}
                    </p>
                </div>
            </div>

            <button
                type="button"
                onClick={onClose}
                className="min-h-12 w-full cursor-pointer rounded-full bg-[#c73a0f] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#952c0c] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c73a0f]"
            >
                Start New Order
            </button>
        </dialog>
    )
}

export default ConfirmOrderModal