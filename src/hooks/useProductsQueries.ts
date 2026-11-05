import { useQuery } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { getProduct, getProducts } from '../services/products'
import type { ProductFilters } from '../services/products'

export function useProductsQuery(filters: ProductFilters = {}) {
    const search = filters.search?.trim() ?? ''
    const category = filters.category?.trim() ?? ''

    const queryKey =
        search || category
            ? ['products', { search, category }]
            : ['products']

    return useQuery({
        queryKey,
        queryFn: ({ signal }) =>
            getProducts({ search, category }, signal),
    })
}

export function useProductQuery(id: string) {
    return useQuery({
        queryKey: ['products', 'detail', id],
        queryFn: ({ signal }) => getProduct(id, signal),
        enabled: Boolean(id),
        retry: (failureCount, error) => {
            if (isAxiosError(error) && error.response?.status === 404) {
                return false
            }

            return failureCount < 1
        },
    })
}