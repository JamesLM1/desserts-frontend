import { api } from './api'
import type { Product } from '../interfaces/product'

export interface ProductFilters {
    search?: string
    category?: string
}

function delay() {
    return new Promise<void>((resolve) => {
        setTimeout(resolve, 1200)
    })
}

export async function getProducts(
    filters: ProductFilters = {},
    signal?: AbortSignal,
): Promise<Product[]> {
    const params: Record<string, string> = {}

    const search = filters.search?.trim()
    const category = filters.category?.trim()

    if (search) {
        params['name:contains'] = search
    }

    if (category) {
        params.category = category
    }

    await delay()

    const { data } = await api.get<Product[]>('/products', {
        params,
        signal,
    })

    return data
}

export async function getProduct(
    id: string,
    signal?: AbortSignal,
): Promise<Product> {
    await delay()

    const { data } = await api.get<Product>(
        `/products/${encodeURIComponent(id)}`,
        { signal },
    )

    return data
}