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
                aria-disabled={!onDecrease}
                aria-label={`Decrease quantity of ${productName}`}
                className="group flex h-11 w-11 cursor-pointer items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-white text-white transition-colors duration-150 group-hover:bg-white group-hover:text-[#c73a0f] group-focus-visible:bg-white group-focus-visible:text-[#c73a0f]">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 10 10"
                        fill="none"
                        aria-hidden="true"
                        className="h-3 w-3"
                    >
                        <path
                            d="M1 5h8"
                            stroke="currentColor"
                            strokeWidth="1.5"
                        />
                    </svg>
                </span>
            </button>

            <span className="text-sm font-semibold">
                {quantity}
            </span>

            <button
                type="button"
                onClick={onIncrease}
                aria-disabled={!onIncrease}
                aria-label={`Increase quantity of ${productName}`}
                className="group flex h-11 w-11 cursor-pointer items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-white text-white transition-colors duration-150 group-hover:bg-white group-hover:text-[#c73a0f] group-focus-visible:bg-white group-focus-visible:text-[#c73a0f]">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 10 10"
                        fill="none"
                        aria-hidden="true"
                        className="h-3 w-3"
                    >
                        <path
                            d="M1 5h8M5 1v8"
                            stroke="currentColor"
                            strokeWidth="1.5"
                        />
                    </svg>
                </span>
            </button>
        </div>
    )
}

export default QuantityStepper