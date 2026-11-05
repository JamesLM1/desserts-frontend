import { useState } from 'react'
import { useSearchParams } from 'react-router'
import Header from '../components/Header'
import ProductCard from '../components/ProductCard'
import ProductCardSkeleton from '../components/ProductCardSkeleton'
import CartSummary from '../components/CartSummary'
import ConfirmOrderModal from '../components/ConfirmOrderModal'
import { useProductsQuery } from '../hooks/useProductsQueries'
import { cartPreviewItems } from '../data/cartPreview'

const SHOW_CART_PREVIEW = true

const cartItems = SHOW_CART_PREVIEW ? cartPreviewItems : []

function ProductsPage() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false)

    const search = searchParams.get('search') ?? ''
    const category = searchParams.get('category') ?? ''

    const catalogQuery = useProductsQuery()
    const productsQuery = useProductsQuery({ search, category })

    const categories = [
        ...new Set(
            (catalogQuery.data ?? []).map((product) => product.category),
        ),
    ].sort()

    function updateFilter(name: string, value: string) {
        setSearchParams(
            (previous) => {
                const next = new URLSearchParams(previous)

                if (value) {
                    next.set(name, value)
                } else {
                    next.delete(name)
                }

                return next
            },
            { replace: true },
        )
    }

    return (
        <>
            <main className="mx-auto min-h-screen max-w-[1440px] px-6 py-6 sm:px-10 sm:py-10 xl:px-28 xl:py-22">
                <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_384px]">
                    <section
                        aria-labelledby="desserts-title"
                        className="min-w-0"
                    >
                        <Header />

                        <div className="mb-8 grid gap-4 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="product-search"
                                    className="mb-2 block text-sm font-semibold"
                                >
                                    Search desserts
                                </label>

                                <input
                                    id="product-search"
                                    type="search"
                                    value={search}
                                    onChange={(event) =>
                                        updateFilter('search', event.target.value)
                                    }
                                    placeholder="Search by name..."
                                    className="min-h-12 w-full rounded-lg border border-[#ad8985] bg-white px-4 text-base outline-none placeholder:text-[#87635a] focus:border-[#c73a0f] focus:ring-2 focus:ring-[#c73a0f]/20"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="product-category"
                                    className="mb-2 block text-sm font-semibold"
                                >
                                    Category
                                </label>

                                <select
                                    id="product-category"
                                    value={category}
                                    disabled={
                                        catalogQuery.isPending || catalogQuery.isError
                                    }
                                    onChange={(event) =>
                                        updateFilter('category', event.target.value)
                                    }
                                    className="min-h-12 w-full rounded-lg border border-[#ad8985] bg-white px-4 text-base outline-none focus:border-[#c73a0f] focus:ring-2 focus:ring-[#c73a0f]/20 disabled:opacity-60"
                                >
                                    <option value="">All categories</option>

                                    {category && !categories.includes(category) && (
                                        <option value={category}>{category}</option>
                                    )}

                                    {categories.map((name) => (
                                        <option key={name} value={name}>
                                            {name}
                                        </option>
                                    ))}
                                </select>

                                {catalogQuery.isError && (
                                    <p className="mt-2 text-sm text-[#c73a0f]">
                                        Categories could not be loaded.{' '}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                void catalogQuery.refetch()
                                            }}
                                            className="cursor-pointer font-semibold underline"
                                        >
                                            Retry
                                        </button>
                                    </p>
                                )}
                            </div>
                        </div>

                        <div aria-busy={productsQuery.isFetching}>
                            {productsQuery.isPending && (
                                <div role="status">
                                    <span className="sr-only">
                                        Loading products...
                                    </span>

                                    <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
                                        {Array.from({ length: 9 }, (_, index) => (
                                            <ProductCardSkeleton key={index} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {productsQuery.isError && (
                                <div
                                    role="alert"
                                    className="rounded-xl bg-white p-6 text-center"
                                >
                                    <p className="font-semibold">
                                        We couldn't load the products.
                                    </p>

                                    <p className="mt-2 text-sm text-[#87635a]">
                                        Please try again.
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            void productsQuery.refetch()
                                        }}
                                        className="mt-4 min-h-11 cursor-pointer rounded-full bg-[#c73a0f] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#952c0c]"
                                    >
                                        Retry
                                    </button>
                                </div>
                            )}

                            {productsQuery.isSuccess &&
                                productsQuery.data.length === 0 && (
                                    <div
                                        role="status"
                                        className="rounded-xl bg-white p-6 text-center"
                                    >
                                        <p className="font-semibold">
                                            No desserts found.
                                        </p>

                                        <p className="mt-2 text-sm text-[#87635a]">
                                            Try another name or category.
                                        </p>
                                    </div>
                                )}

                            {productsQuery.isSuccess &&
                                productsQuery.data.length > 0 && (
                                    <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
                                        {productsQuery.data.map((product) => {
                                            const quantity =
                                                cartItems.find(
                                                    (item) =>
                                                        String(item.product.id) === product.id,
                                                )?.quantity ?? 0

                                            return (
                                                <ProductCard
                                                    key={product.id}
                                                    product={product}
                                                    quantity={quantity}
                                                    detailsUrl={`/producto/${encodeURIComponent(product.id)}`}
                                                />
                                            )
                                        })}
                                    </div>
                                )}
                        </div>
                    </section>

                    <CartSummary
                        items={cartItems}
                        onConfirm={() => setIsConfirmationOpen(true)}
                    />
                </div>
            </main>

            <ConfirmOrderModal
                isOpen={isConfirmationOpen}
                onClose={() => setIsConfirmationOpen(false)}
            />
        </>
    )
}

export default ProductsPage