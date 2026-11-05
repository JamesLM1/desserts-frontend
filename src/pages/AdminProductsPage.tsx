import { useState } from 'react'
import { Link } from 'react-router'
import type { Product } from '../interfaces/product'
import { useProductsQuery } from '../hooks/useProductsQueries'
import { useProductsMutations } from '../hooks/useProductsMutations'
import { useCatalogFilters } from '../hooks/useCatalogFilters'
import ProductFilters from '../components/ProductFilters'
import Pagination from '../components/Pagination'
import CategoryBadge from '../components/CategoryBadge'
import DeleteProductDialog from '../components/DeleteProductDialog'
import ProductImage from '../components/ProductImage'
import ErrorState from '../components/ErrorState'

export default function AdminProductsPage() {
    const filters = useCatalogFilters()
    const products = useProductsQuery(filters)
    const { remove } = useProductsMutations()
    const [selected, setSelected] = useState<Product | null>(null)
    function selectProduct(product: Product) { remove.reset(); setSelected(product) }
    async function confirmDelete() {
        if (!selected) return
        try { await remove.mutateAsync(selected.id); setSelected(null) }
        catch { /* The mutation displays a toast and the dialog keeps the error visible. */ }
    }
    return <main className="mx-auto min-h-screen max-w-6xl px-6 py-8 sm:px-10">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div><h1 className="text-3xl font-bold sm:text-4xl">Product management</h1><p className="mt-2 text-sm text-[#87635a]">Create, edit and organize the desserts in your local catalog.</p></div>
            <Link to="/admin/products/new" className="button-primary">New product</Link>
        </div>
        <ProductFilters search={filters.search} categoryId={filters.categoryId} onChange={filters.updateFilter} />
        <div aria-busy={products.isFetching}>
            {products.isPending && <div role="status" className="space-y-4 rounded-xl bg-white p-6">
                <span className="sr-only">Loading products...</span>
                {Array.from({ length: 8 }, (_, index) => <div key={index} className="h-16 rounded-lg bg-[#f4edeb] motion-safe:animate-pulse" />)}
            </div>}
            {products.isError && <ErrorState error={products.error} onRetry={() => { void products.refetch() }} />}
            {products.isSuccess && <>
                {products.data.data.length === 0 ? <p role="status" className="rounded-xl bg-white p-8 text-center">No desserts found. Try another filter or create a product.</p>
                    : <div className="overflow-x-auto rounded-xl bg-white">
                        <table className="w-full min-w-[640px] text-left text-sm">
                            <caption className="sr-only">Products with category, price and editing actions</caption>
                            <thead className="border-b border-[#f4edeb] text-[#87635a]"><tr><th scope="col" className="p-4">Product</th><th scope="col" className="p-4">Category</th><th scope="col" className="p-4">Price</th><th scope="col" className="p-4">Actions</th></tr></thead>
                            <tbody className="divide-y divide-[#f4edeb]">
                                {products.data.data.map((product) => <tr key={product.id}>
                                    <td className="p-4"><Link to={'/producto/' + encodeURIComponent(product.id)} className="flex items-center gap-3 rounded font-semibold hover:text-[#c73a0f]">
                                        <ProductImage src={product.image} alt="" thumbnail className="h-12 w-12 rounded object-cover" />{product.name}
                                    </Link></td>
                                    <td className="p-4"><CategoryBadge name={product.category?.name ?? 'Uncategorized'} /></td>
                                    <td className="p-4">${product.price.toFixed(2)}</td>
                                    <td className="p-4"><div className="flex gap-2">
                                        <Link to={'/admin/products/' + encodeURIComponent(product.id) + '/edit'} aria-label={'Edit ' + product.name} className="button-secondary">Edit</Link>
                                        <button type="button" onClick={() => selectProduct(product)} aria-label={'Delete ' + product.name} className="button-secondary">Delete</button>
                                    </div></td>
                                </tr>)}
                            </tbody>
                        </table>
                    </div>}
                <Pagination data={products.data} requestedPage={filters.page} onChange={filters.setPage} disabled={products.isFetching} />
            </>}
        </div>
        <DeleteProductDialog product={selected} isPending={remove.isPending} error={remove.error}
            onClose={() => setSelected(null)} onDelete={() => { void confirmDelete() }} />
    </main>
}
