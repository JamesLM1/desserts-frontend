export interface Category {
    id: string
    name: string
}

export interface Product {
    id: string
    name: string
    categoryId: string
    price: number
    image: string
    category?: Category
}

export type ProductInput = Omit<Product, 'id' | 'category'>

export interface ProductFilters {
    search?: string
    categoryId?: string
    page?: number
}

export interface ProductPage {
    first: number
    prev: number | null
    next: number | null
    last: number
    pages: number
    items: number
    data: Product[]
}
