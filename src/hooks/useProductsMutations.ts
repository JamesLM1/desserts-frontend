import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createProduct, deleteProduct, updateProduct } from '../services/products'
import { apiErrorMessage } from '../services/errors'
import { productKeys } from './useProductsQueries'
import { notify } from '../stores/toastStore'
import { useCartStore } from '../stores/cartStore'
import type { Category, Product, ProductInput } from '../interfaces/product'

export function useProductsMutations() {
    const queryClient = useQueryClient()
    const onError = (error: unknown) => notify(apiErrorMessage(error), 'error')
    async function saved(product: Product, message: string) {
        const category = queryClient.getQueryData<Category[]>(['categories'])?.find((item) => item.id === product.categoryId)
        const updated = { ...product, category }
        queryClient.setQueryData(productKeys.detail(product.id), updated)
        useCartStore.getState().refreshProduct(updated)
        await queryClient.invalidateQueries({ queryKey: productKeys.all })
        notify(message)
    }
    const create = useMutation({
        mutationFn: createProduct,
        onSuccess: (product) => saved(product, 'Product created successfully.'),
        onError,
    })
    const update = useMutation({
        mutationFn: ({ id, product }: { id: string; product: ProductInput }) => updateProduct(id, product),
        onSuccess: (product) => saved(product, 'Product updated successfully.'),
        onError,
    })
    const remove = useMutation({
        mutationFn: deleteProduct,
        onSuccess: async (_, id) => {
            useCartStore.getState().remove(id)
            queryClient.removeQueries({ queryKey: productKeys.detail(id), exact: true })
            await queryClient.invalidateQueries({ queryKey: productKeys.all })
            notify('Product deleted successfully.')
        },
        onError,
    })
    return { create, update, remove }
}
