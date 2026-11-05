import { CanceledError } from 'axios'
import { api } from './api'
import type { Category, Product, ProductFilters, ProductInput, ProductPage } from '../interfaces/product'

export const PAGE_SIZE = 8

function delay(signal?: AbortSignal) {
    const configuredDelay = Number(import.meta.env.VITE_API_DELAY_MS ?? 1200)
    const milliseconds = Number.isFinite(configuredDelay) ? Math.max(0, configuredDelay) : 1200
    return new Promise<void>((resolve, reject) => {
        if (signal?.aborted) {
            reject(new CanceledError())
            return
        }
        const onAbort = () => {
            clearTimeout(timer)
            reject(new CanceledError())
        }
        const timer = setTimeout(() => {
            signal?.removeEventListener('abort', onAbort)
            resolve()
        }, milliseconds)
        signal?.addEventListener('abort', onAbort, { once: true })
    })
}

export async function getProducts(filters: ProductFilters = {}, signal?: AbortSignal): Promise<ProductPage> {
    const params: Record<string, string | number> = {
        _page: filters.page ?? 1,
        _per_page: PAGE_SIZE,
        _embed: 'category',
    }
    if (filters.search?.trim()) params['name:contains'] = filters.search.trim()
    if (filters.categoryId) params.categoryId = filters.categoryId
    await delay(signal)
    const { data } = await api.get<ProductPage>('/products', { params, signal })
    return data
}

export async function getProduct(id: string, signal?: AbortSignal): Promise<Product> {
    await delay(signal)
    const { data } = await api.get<Product>('/products/' + encodeURIComponent(id), {
        params: { _embed: 'category' }, signal,
    })
    return data
}

export async function getCategories(signal?: AbortSignal): Promise<Category[]> {
    const { data } = await api.get<Category[]>('/categories', { signal })
    return data
}

export async function createProduct(product: ProductInput): Promise<Product> {
    const { data } = await api.post<Product>('/products', product)
    return data
}

export async function updateProduct(id: string, product: ProductInput): Promise<Product> {
    const { data } = await api.put<Product>('/products/' + encodeURIComponent(id), product)
    return data
}

export async function deleteProduct(id: string): Promise<void> {
    await api.delete('/products/' + encodeURIComponent(id))
}
