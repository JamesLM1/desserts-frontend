interface QuantityStepperProps {
    quantity: number
    productName: string
    onDecrease?: () => void
    onIncrease?: () => void
}

function QuantityStepper({
    quantity,
    productName,
    onDecrease,
    onIncrease,
}: QuantityStepperProps) {
    return (
        <div
            role="group"
            aria-label={`Quantity of ${productName}`}
            className="flex min-h-11 w-40 items-center justify-between rounded-full bg-[#c73a0f] px-2 text-white"
        >
            <button
                type="button"
                onClick={onDecrease}
                disabled={!onDecrease}
                aria-label={`Decrease quantity of ${productName}`}
                className="flex h-11 w-11 items-center justify-center rounded-full transition-colors enabled:cursor-pointer enabled:hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-white">
                    <img
                        src="/assets/images/icon-decrement-quantity.svg"
                        alt=""
                        className="h-3 w-3"
                    />
                </span>
            </button>

            <span className="text-sm font-semibold">
                {quantity}
            </span>

            <button
                type="button"
                onClick={onIncrease}
                disabled={!onIncrease}
                aria-label={`Increase quantity of ${productName}`}
                className="flex h-11 w-11 items-center justify-center rounded-full transition-colors enabled:cursor-pointer enabled:hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-white">
                    <img
                        src="/assets/images/icon-increment-quantity.svg"
                        alt=""
                        className="h-3 w-3"
                    />
                </span>
            </button>
        </div>
    )
}

export default QuantityStepper