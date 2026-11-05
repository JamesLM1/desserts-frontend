import { Link } from 'react-router'
import type { Product } from '../interfaces/product'
import QuantityStepper from './QuantityStepper'

interface ProductCardProps {
    product: Omit<Product, 'id'>
    quantity?: number
    detailsUrl?: string
}

function ProductCard({
    product,
    quantity = 0,
    detailsUrl,
}: ProductCardProps) {
    const productImage = (
        <picture className="block">
            <source
                media="(min-width: 1024px)"
                srcSet={product.image}
            />

            <source
                media="(min-width: 640px)"
                srcSet={product.image.replace(
                    '-desktop.jpg',
                    '-tablet.jpg',
                )}
            />

            <img
                src={product.image.replace(
                    '-desktop.jpg',
                    '-mobile.jpg',
                )}
                alt={product.name}
                className={`aspect-[327/212] w-full rounded-lg border-2 object-cover sm:aspect-[502/480] ${quantity > 0
                        ? 'border-[#c73a0f]'
                        : 'border-transparent'
                    }`}
            />
        </picture>
    )

    return (
        <article>
            <div className="relative mb-9">
                {detailsUrl ? (
                    <Link
                        to={detailsUrl}
                        className="block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c73a0f]"
                    >
                        {productImage}
                    </Link>
                ) : (
                    productImage
                )}

                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                    {quantity > 0 ? (
                        <QuantityStepper
                            quantity={quantity}
                            productName={product.name}
                        />
                    ) : (
                        <button
                            type="button"
                            aria-label={`Add ${product.name} to cart`}
                            className="flex min-h-11 w-40 cursor-pointer items-center justify-center gap-2 rounded-full border border-[#ad8985] bg-white px-3 text-sm font-semibold text-[#260f08] transition-colors hover:border-[#c73a0f] hover:text-[#c73a0f] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c73a0f]"
                        >
                            <img
                                src="/assets/images/icon-add-to-cart.svg"
                                alt=""
                                className="h-5 w-5"
                            />

                            Add to Cart
                        </button>
                    )}
                </div>
            </div>

            <div className="space-y-1">
                <p className="text-sm text-[#87635a]">
                    {product.category}
                </p>

                <h2 className="text-base font-semibold">
                    {detailsUrl ? (
                        <Link
                            to={detailsUrl}
                            className="rounded transition-colors hover:text-[#c73a0f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c73a0f]"
                        >
                            {product.name}
                        </Link>
                    ) : (
                        product.name
                    )}
                </h2>

                <p className="text-base font-semibold text-[#c73a0f]">
                    ${product.price.toFixed(2)}
                </p>
            </div>
        </article>
    )
}

export default ProductCard