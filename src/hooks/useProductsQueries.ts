import { useQuery } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { getCategories, getProduct, getProducts } from '../services/products'
import type { ProductFilters } from '../interfaces/product'

export const productKeys = {
    all: ['products'] as const,
    list: (filters: ProductFilters) => ['products', filters] as const,
    detail: (id: string) => ['products', 'detail', id] as const,
}

export function useProductsQuery(filters: ProductFilters = {}) {
    const normalized = {
        search: filters.search?.trim() ?? '',
        categoryId: filters.categoryId ?? '',
        page: filters.page ?? 1,
    }
    return useQuery({
        queryKey: productKeys.list(normalized),
        queryFn: ({ signal }) => getProducts(normalized, signal),
    })
}

export function useProductQuery(id: string) {
    return useQuery({
        queryKey: productKeys.detail(id),
        queryFn: ({ signal }) => getProduct(id, signal),
        enabled: Boolean(id),
        retry: (failureCount, error) => {
            if (isAxiosError(error) && error.response?.status === 404) return false
            return failureCount < 1
        },
    })
}

export function useCategoriesQuery() {
    return useQuery({
        queryKey: ['categories'],
        queryFn: ({ signal }) => getCategories(signal),
        staleTime: 5 * 60_000,
    })
}
