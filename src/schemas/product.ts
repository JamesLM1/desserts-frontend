import { z } from 'zod'
import type { FieldErrors, Resolver } from 'react-hook-form'

export const productSchema = z.object({
    name: z.string().trim().min(3, 'Enter at least 3 characters.').max(100, 'Use at most 100 characters.'),
    price: z.number().finite().positive('Price must be greater than zero.').max(10_000, 'Price cannot exceed 10,000.')
        .refine((price) => Math.abs(price * 100 - Math.round(price * 100)) < 0.000001, 'Use at most two decimal places.'),
    categoryId: z.string().min(1, 'Choose a category.'),
    image: z.string().trim().min(1, 'Enter an image URL or a local image path.').max(2048)
        .refine((image) => {
            if (/\s/.test(image)) return false
            if (image.startsWith('/')) {
                try {
                    const path = decodeURIComponent(image)
                    return /^\/(?!\/)[^\\?#\s]+\.(avif|gif|jpe?g|png|svg|webp)$/i.test(path)
                        && !path.split('/').some((segment) => segment === '.' || segment === '..')
                } catch { return false }
            }
            if (!/^https?:\/\/[^\\\s]+$/i.test(image)) return false
            try {
                const url = new URL(image)
                return (url.protocol === 'https:' || url.protocol === 'http:')
                    && Boolean(url.hostname) && !url.username && !url.password
            } catch { return false }
        }, 'Use an http(s) image URL or a local path such as /assets/images/my-dessert.jpg.'),
})

export type ProductFormValues = z.infer<typeof productSchema>

// A typed RHF resolver keeps the schema as the single source of validation.
export const productResolver: Resolver<ProductFormValues> = (values) => {
    const result = productSchema.safeParse(values)
    if (result.success) return { values: result.data, errors: {} }
    const errors: FieldErrors<ProductFormValues> = {}
    for (const issue of result.error.issues) {
        const field = issue.path[0]
        if (field === 'name' || field === 'price' || field === 'categoryId' || field === 'image') {
            errors[field] ??= { type: issue.code, message: issue.message }
        }
    }
    return { values: {}, errors }
}
