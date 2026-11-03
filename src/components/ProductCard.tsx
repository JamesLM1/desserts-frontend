import type { Product } from '../data/products'

interface ProductCardProps {
    product: Product
}

function ProductCard({ product }: ProductCardProps) {
    return (
        <article>
            <div className="relative mb-9">
                <img
                    src={product.image}
                    alt={product.name}
                    className="aspect-[1.05] w-full rounded-lg object-cover"
                />

                <button
                    type="button"
                    aria-label={`Add ${product.name} to cart`}
                    className="absolute bottom-0 left-1/2 flex min-h-11 w-40 -translate-x-1/2 translate-y-1/2 cursor-pointer items-center justify-center gap-2 rounded-full border border-[#ad8985] bg-white px-3 text-sm font-semibold text-[#260f08] transition-colors hover:border-[#c73a0f] hover:text-[#c73a0f] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c73a0f]"
                >
                    <img
                        src="/assets/images/icon-add-to-cart.svg"
                        alt=""
                        className="h-5 w-5"
                    />
                    Add to Cart
                </button>
            </div>

            <div className="space-y-1">
                <p className="text-sm text-[#87635a]">
                    {product.category}
                </p>

                <h2 className="text-base font-semibold">
                    {product.name}
                </h2>

                <p className="text-base font-semibold text-[#c73a0f]">
                    ${product.price.toFixed(2)}
                </p>
            </div>
        </article>
    )
}

export default ProductCard