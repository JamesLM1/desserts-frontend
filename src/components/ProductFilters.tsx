import { useCategoriesQuery } from '../hooks/useProductsQueries'

interface ProductFiltersProps {
    search: string
    categoryId: string
    onChange: (name: 'search' | 'categoryId', value: string) => void
}

export default function ProductFilters({ search, categoryId, onChange }: ProductFiltersProps) {
    const categories = useCategoriesQuery()
    return <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <div>
            <label htmlFor="product-search" className="field-label">Search desserts</label>
            <input id="product-search" type="search" value={search} onChange={(event) => onChange('search', event.target.value)}
                placeholder="Search by name..." className="field-input" />
        </div>
        <div>
            <label htmlFor="product-category" className="field-label">Category</label>
            <select id="product-category" value={categoryId} disabled={categories.isPending || categories.isError}
                onChange={(event) => onChange('categoryId', event.target.value)} className="field-input">
                <option value="">All categories</option>
                {categoryId && !categories.data?.some((item) => item.id === categoryId) && <option value={categoryId}>Unknown category</option>}
                {categories.data?.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
            </select>
            {categories.isError && <p role="alert" className="mt-2 text-sm text-[#c73a0f]">
                Categories could not be loaded. <button type="button" onClick={() => { void categories.refetch() }} className="font-semibold underline">Retry categories</button>
            </p>}
        </div>
    </div>
}
