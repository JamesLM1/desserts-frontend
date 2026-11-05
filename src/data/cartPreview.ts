import { products } from './products'

const previewSelection = [
    { productId: 4, quantity: 1 },
    { productId: 2, quantity: 4 },
    { productId: 9, quantity: 2 },
]

export const cartPreviewItems = previewSelection.flatMap(
    ({ productId, quantity }) => {
        const product = products.find(
            (product) => product.id === productId,
        )

        return product ? [{ product, quantity }] : []
    },
)