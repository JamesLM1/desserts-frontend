function ProductCardSkeleton() {
    return (
        <article
            aria-hidden="true"
            className="motion-safe:animate-pulse"
        >
            <div className="relative mb-9">
                <div className="aspect-[327/212] w-full rounded-lg bg-[#f4edeb] sm:aspect-[502/480]" />

                <div className="absolute bottom-0 left-1/2 flex min-h-11 w-40 -translate-x-1/2 translate-y-1/2 items-center justify-center rounded-full border border-[#f4edeb] bg-white">
                    <div className="h-4 w-24 rounded bg-[#f4edeb]" />
                </div>
            </div>

            <div className="space-y-2">
                <div className="h-4 w-20 rounded bg-[#f4edeb]" />

                <div className="h-5 w-4/5 rounded bg-[#f4edeb]" />

                <div className="h-5 w-14 rounded bg-[#f4edeb]" />
            </div>
        </article>
    )
}

export default ProductCardSkeleton