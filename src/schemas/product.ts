import { z } from 'zod'
import type { FieldErrors, Resolver } from 'react-hook-form'

export const productSchema = z.object({
    name: z.string().trim().min(3, 'Enter at least 3 characters.').max(100, 'Use at most 100 characters.'),
    price: z.number().finite().positive('Price must be greater than zero.').max(10_000, 'Price cannot exceed 10,000.')
        .refine((price) => Math.abs(price * 100 - Math.round(price * 100)) < 0.000001, 'Use at most two decimal places.'),
    categoryId: z.string().min(1, 'Choose a category.'),
    image: z.string().startsWith('/assets/images/', 'Choose a local product image.')
        .refine((image) => !image.includes('..') && !image.includes('?') && !image.includes('#'), 'Use a valid local image path.'),
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
