import { isAxiosError } from 'axios'
import { Link, useParams } from 'react-router'
import { useProductQuery } from '../hooks/useProductsQueries'

function ProductDetailPage() {
    const { id = '' } = useParams()
    const productQuery = useProductQuery(id)

    const isNotFound =
        !id ||
        (isAxiosError(productQuery.error) &&
            productQuery.error.response?.status === 404)

    return (
        <main className="mx-auto min-h-screen max-w-5xl px-6 py-8 sm:px-10 sm:py-16">
            <Link
                to="/"
                className="mb-8 inline-flex min-h-11 items-center gap-2 rounded text-sm font-semibold text-[#87635a] transition-colors hover:text-[#c73a0f] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c73a0f]"
            >
                <span aria-hidden="true">←</span>
                Back to desserts
            </Link>

            {isNotFound && (
                <section className="rounded-xl bg-white p-8 text-center">
                    <h1 className="text-5xl font-bold text-[#c73a0f]">
                        404
                    </h1>

                    <p className="mt-4 text-xl font-semibold">
                        Product not found
                    </p>

                    <p className="mt-2 text-[#87635a]">
                        This dessert does not exist or is no longer available.
                    </p>
                </section>
            )}

            {!isNotFound && productQuery.isPending && (
                <div role="status">
                    <span className="sr-only">
                        Loading product details...
                    </span>

                    <div
                        aria-hidden="true"
                        className="grid gap-8 motion-safe:animate-pulse sm:grid-cols-2"
                    >
                        <div className="aspect-[327/212] rounded-xl bg-[#f4edeb] sm:aspect-[502/480]" />

                        <div className="space-y-5 py-4">
                            <div className="h-5 w-24 rounded bg-[#f4edeb]" />
                            <div className="h-10 w-full rounded bg-[#f4edeb]" />
                            <div className="h-8 w-24 rounded bg-[#f4edeb]" />
                            <div className="h-12 w-40 rounded-full bg-[#f4edeb]" />
                        </div>
                    </div>
                </div>
            )}

            {!isNotFound && productQuery.isError && (
                <section
                    role="alert"
                    className="rounded-xl bg-white p-8 text-center"
                >
                    <h1 className="text-2xl font-bold">
                        We couldn't load this dessert.
                    </h1>

                    <p className="mt-2 text-[#87635a]">
                        Please try again.
                    </p>

                    <button
                        type="button"
                        onClick={() => {
                            void productQuery.refetch()
                        }}
                        className="mt-6 min-h-12 cursor-pointer rounded-full bg-[#c73a0f] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#952c0c] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c73a0f]"
                    >
                        Retry
                    </button>
                </section>
            )}

            {!isNotFound && productQuery.isSuccess && (
                <article className="grid items-start gap-8 sm:grid-cols-2">
                    <picture className="block">
                        <source
                            media="(min-width: 1024px)"
                            srcSet={productQuery.data.image}
                        />

                        <source
                            media="(min-width: 640px)"
                            srcSet={productQuery.data.image.replace(
                                '-desktop.jpg',
                                '-tablet.jpg',
                            )}
                        />

                        <img
                            src={productQuery.data.image.replace(
                                '-desktop.jpg',
                                '-mobile.jpg',
                            )}
                            alt={productQuery.data.name}
                            className="aspect-[327/212] w-full rounded-xl object-cover sm:aspect-[502/480]"
                        />
                    </picture>

                    <div className="py-2 sm:py-4">
                        <p className="text-sm text-[#87635a]">
                            {productQuery.data.category}
                        </p>

                        <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
                            {productQuery.data.name}
                        </h1>

                        <p className="mt-6 text-2xl font-semibold text-[#c73a0f]">
                            ${productQuery.data.price.toFixed(2)}
                        </p>

                        <button
                            type="button"
                            aria-disabled="true"
                            className="mt-8 flex min-h-12 w-40 cursor-pointer items-center justify-center gap-2 rounded-full border border-[#ad8985] bg-white px-4 text-sm font-semibold transition-colors hover:border-[#c73a0f] hover:text-[#c73a0f] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c73a0f]"
                        >
                            <img
                                src="/assets/images/icon-add-to-cart.svg"
                                alt=""
                                className="h-5 w-5"
                            />

                            Add to Cart
                        </button>
                    </div>
                </article>
            )}
        </main>
    )
}

export default ProductDetailPage