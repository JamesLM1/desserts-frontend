import Header from '../components/Header'
import ProductCard from '../components/ProductCard'
import ProductCardSkeleton from '../components/ProductCardSkeleton'
import CartSummary from '../components/CartSummary'
import ProductFilters from '../components/ProductFilters'
import Pagination from '../components/Pagination'
import ErrorState from '../components/ErrorState'
import { useProductsQuery } from '../hooks/useProductsQueries'
import { useCatalogFilters } from '../hooks/useCatalogFilters'
import { useShopActions } from '../hooks/useShopActions'
import { useCartStore } from '../stores/cartStore'

export default function ProductsPage() {
    const filters = useCatalogFilters()
    const products = useProductsQuery(filters)
    const items = useCartStore((state) => state.items)
    const { openCart, confirmOrder } = useShopActions()
    return <main className="mx-auto min-h-screen max-w-[1440px] px-6 py-8 sm:px-10 sm:py-10 xl:px-28">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_384px]">
            <section aria-labelledby="desserts-title" className="min-w-0">
                <Header />
                <ProductFilters search={filters.search} categoryId={filters.categoryId} onChange={filters.updateFilter} />
                <div aria-busy={products.isFetching}>
                    {products.isPending && <div role="status">
                        <span className="sr-only">Loading products...</span>
                        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
                            {Array.from({ length: 8 }, (_, index) => <ProductCardSkeleton key={index} />)}
                        </div>
                    </div>}
                    {products.isError && <ErrorState error={products.error} onRetry={() => { void products.refetch() }} />}
                    {products.isSuccess && <>
                        {products.data.data.length === 0 ? <div role="status" className="rounded-xl bg-white p-6 text-center">
                            <p className="font-semibold">No desserts found.</p>
                            <p className="mt-2 text-sm text-[#87635a]">Try another name or category.</p>
                        </div> : <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
                            {products.data.data.map((product) => <ProductCard key={product.id} product={product} />)}
                        </div>}
                        <Pagination data={products.data} requestedPage={filters.page} onChange={filters.setPage} disabled={products.isFetching} />
                    </>}
                </div>
            </section>
            <CartSummary items={items} onConfirm={confirmOrder} onOpenDrawer={openCart} />
        </div>
    </main>
}
