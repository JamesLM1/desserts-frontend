import { Link } from 'react-router'
import type { Product } from '../interfaces/product'
import { MAX_QUANTITY, useCartStore } from '../stores/cartStore'
import ProductImage from './ProductImage'
import QuantityStepper from './QuantityStepper'
import CategoryBadge from './CategoryBadge'

export default function ProductCard({ product }: { product: Product }) {
    const quantity = useCartStore((state) => state.items.find((item) => item.product.id === product.id)?.quantity ?? 0)
    const add = useCartStore((state) => state.add)
    const decrease = useCartStore((state) => state.decrease)
    const url = '/producto/' + encodeURIComponent(product.id)
    return <article>
        <div className="relative mb-9">
            <Link to={url} className="block rounded-lg">
                <ProductImage src={product.image} alt={product.name}
                    className={'aspect-[327/212] w-full rounded-lg border-2 object-cover sm:aspect-[502/480] ' + (quantity > 0 ? 'border-[#c73a0f]' : 'border-transparent')} />
            </Link>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                {quantity > 0 ? <QuantityStepper quantity={quantity} productName={product.name}
                    onDecrease={() => decrease(product.id)} onIncrease={quantity < MAX_QUANTITY ? () => add(product) : undefined} />
                    : <button type="button" aria-label={'Add ' + product.name + ' to cart'} onClick={() => add(product)}
                        className="flex min-h-11 w-40 items-center justify-center gap-2 rounded-full border border-[#ad8985] bg-white px-3 text-sm font-semibold hover:border-[#c73a0f] hover:text-[#c73a0f]">
                        <img src="/assets/images/icon-add-to-cart.svg" alt="" className="h-5 w-5" />Add to Cart
                    </button>}
            </div>
        </div>
        <div className="space-y-1">
            <CategoryBadge name={product.category?.name ?? 'Uncategorized'} />
            <h2 className="text-base font-semibold"><Link to={url} className="rounded transition-colors hover:text-[#c73a0f]">{product.name}</Link></h2>
            <p className="text-base font-semibold text-[#c73a0f]">${product.price.toFixed(2)}</p>
        </div>
    </article>
}
