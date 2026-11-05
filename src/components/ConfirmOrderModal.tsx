import { useEffect, useRef } from 'react'
import { cartPreviewItems } from '../data/cartPreview'

interface ConfirmOrderModalProps {
    isOpen: boolean
    onClose: () => void
}

const orderTotal = cartPreviewItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
)

function ConfirmOrderModal({
    isOpen,
    onClose,
}: ConfirmOrderModalProps) {
    const dialogRef = useRef<HTMLDialogElement>(null)

    useEffect(() => {
        if (!isOpen || !dialogRef.current) {
            return
        }

        const dialog = dialogRef.current
        const previousFocus = document.activeElement

        if (!dialog.open) {
            dialog.showModal()
        }

        return () => {
            dialog.close()

            if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
                previousFocus.focus()
            }
        }
    }, [isOpen])

    if (!isOpen) {
        return null
    }

    return (
        <dialog
            ref={dialogRef}
            onCancel={onClose}
            aria-labelledby="confirmation-title"
            aria-describedby="confirmation-description"
            className="fixed inset-x-0 bottom-0 top-auto m-0 max-h-dvh w-full max-w-none overflow-y-auto rounded-t-xl border-0 bg-white px-6 py-10 text-[#260f08] shadow-xl backdrop:bg-black/50 sm:inset-0 sm:m-auto sm:max-h-[90dvh] sm:max-w-148 sm:rounded-xl sm:p-10"
        >
            <img
                src="/assets/images/icon-order-confirmed.svg"
                alt=""
                className="mb-6 h-12 w-12"
            />

            <h2
                id="confirmation-title"
                className="text-[40px] font-bold leading-tight"
            >
                Order Confirmed
            </h2>

            <p
                id="confirmation-description"
                className="mt-2 text-base text-[#87635a]"
            >
                We hope you enjoy your food!
            </p>

            <div className="my-8 rounded-lg bg-[#fcf8f6] px-6">
                <ul className="divide-y divide-[#f4edeb]">
                    {cartPreviewItems.map(({ product, quantity }) => (
                        <li
                            key={product.id}
                            className="flex items-center gap-4 py-4"
                        >
                            <img
                                src={product.image.replace(
                                    '-desktop.jpg',
                                    '-thumbnail.jpg',
                                )}
                                alt=""
                                className="h-12 w-12 shrink-0 rounded object-cover"
                            />

                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold">
                                    {product.name}
                                </p>

                                <div className="mt-2 flex gap-4 text-sm">
                                    <span className="font-semibold text-[#c73a0f]">
                                        {quantity}x
                                    </span>

                                    <span className="text-[#87635a]">
                                        @ ${product.price.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <p className="shrink-0 text-sm font-semibold">
                                ${(product.price * quantity).toFixed(2)}
                            </p>
                        </li>
                    ))}
                </ul>

                <div className="flex items-center justify-between gap-4 border-t border-[#f4edeb] py-6">
                    <p className="text-sm">Order Total</p>

                    <p className="text-2xl font-bold">
                        ${orderTotal.toFixed(2)}
                    </p>
                </div>
            </div>

            <button
                type="button"
                onClick={onClose}
                className="min-h-13 w-full cursor-pointer rounded-full bg-[#c73a0f] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#952c0c] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c73a0f]"
            >
                Start New Order
            </button>
        </dialog>
    )
}

export default ConfirmOrderModal
