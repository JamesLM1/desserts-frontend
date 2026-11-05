import { isAxiosError } from 'axios'
import { Link, useParams } from 'react-router'
import { useProductQuery } from '../hooks/useProductsQueries'
import { useShopActions } from '../hooks/useShopActions'
import { MAX_QUANTITY, useCartStore } from '../stores/cartStore'
import ProductImage from '../components/ProductImage'
import CategoryBadge from '../components/CategoryBadge'
import QuantityStepper from '../components/QuantityStepper'
import ErrorState from '../components/ErrorState'

export default function ProductDetailPage() {
    const { id = '' } = useParams()
    const product = useProductQuery(id)
    const quantity = useCartStore((state) => state.items.find((item) => item.product.id === id)?.quantity ?? 0)
    const add = useCartStore((state) => state.add)
    const decrease = useCartStore((state) => state.decrease)
    const { openCart } = useShopActions()
    const isNotFound = !id || (isAxiosError(product.error) && product.error.response?.status === 404)
    return <main className="mx-auto min-h-screen max-w-5xl px-6 py-8 sm:px-10 sm:py-12">
        <Link to="/" className="mb-8 inline-flex min-h-11 items-center gap-2 rounded text-sm font-semibold text-[#87635a] hover:text-[#c73a0f]">← Back to desserts</Link>
        {isNotFound && <section className="rounded-xl bg-white p-8 text-center">
            <h1 className="text-5xl font-bold text-[#c73a0f]">404</h1>
            <p className="mt-4 text-xl font-semibold">Product not found</p>
            <p className="mt-2 text-[#87635a]">This dessert does not exist or is no longer available.</p>
        </section>}
        {!isNotFound && product.isPending && <div role="status">
            <span className="sr-only">Loading product details...</span>
            <div aria-hidden="true" className="grid gap-8 motion-safe:animate-pulse sm:grid-cols-2">
                <div className="aspect-[327/212] rounded-xl bg-[#f4edeb] sm:aspect-[502/480]" />
                <div className="space-y-5 py-4"><div className="h-5 w-24 rounded bg-[#f4edeb]" /><div className="h-10 w-full rounded bg-[#f4edeb]" /><div className="h-8 w-24 rounded bg-[#f4edeb]" /></div>
            </div>
        </div>}
        {!isNotFound && product.isError && <ErrorState error={product.error} onRetry={() => { void product.refetch() }} />}
        {product.isSuccess && <article className="grid items-start gap-8 sm:grid-cols-2">
            <ProductImage src={product.data.image} alt={product.data.name} className="aspect-[327/212] w-full rounded-xl object-cover sm:aspect-[502/480]" />
            <div className="py-2 sm:py-4">
                <CategoryBadge name={product.data.category?.name ?? 'Uncategorized'} />
                <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">{product.data.name}</h1>
                <p className="mt-6 text-2xl font-semibold text-[#c73a0f]">${product.data.price.toFixed(2)}</p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                    {quantity > 0 ? <QuantityStepper quantity={quantity} productName={product.data.name}
                        onDecrease={() => decrease(id)} onIncrease={quantity < MAX_QUANTITY ? () => add(product.data) : undefined} />
                        : <button type="button" onClick={() => add(product.data)} className="button-primary">Add to Cart</button>}
                    <button type="button" onClick={openCart} className="button-secondary">View cart</button>
                </div>
                <Link to={'/admin/products/' + encodeURIComponent(id) + '/edit'} className="mt-6 inline-block rounded text-sm text-[#87635a] underline">Edit this product</Link>
            </div>
        </article>}
    </main>
}
