interface HeaderProps {
    onOpenCart: () => void
    isCartOpen: boolean
}

function Header({ onOpenCart, isCartOpen }: HeaderProps) {
    return (
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <h1
                id="desserts-title"
                className="text-[40px] font-bold leading-tight"
            >
                Desserts
            </h1>

            <button
                type="button"
                onClick={onOpenCart}
                aria-haspopup="dialog"
                aria-expanded={isCartOpen}
                className="flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full border border-[#ad8985] bg-white px-5 py-3 text-sm font-semibold transition-colors hover:border-[#c73a0f] hover:text-[#c73a0f] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c73a0f]"
            >
                <img
                    src="/assets/images/icon-add-to-cart.svg"
                    alt=""
                    className="h-5 w-5"
                />

                Cart (0)
            </button>
        </header>
    )
}

export default Header