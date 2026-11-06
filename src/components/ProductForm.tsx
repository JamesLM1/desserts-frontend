import { Link } from 'react-router'
import { useForm, useWatch } from 'react-hook-form'
import { productResolver, productSchema } from '../schemas/product'
import type { ProductFormValues } from '../schemas/product'
import { useCategoriesQuery } from '../hooks/useProductsQueries'
import { productImages } from '../data/productImages'
import { apiErrorMessage } from '../services/errors'
import ErrorState from './ErrorState'
import ProductImage from './ProductImage'

interface ProductFormProps {
    defaultValues: ProductFormValues
    submitLabel: string
    onSubmit: (values: ProductFormValues) => Promise<void>
}

export default function ProductForm({ defaultValues, submitLabel, onSubmit }: ProductFormProps) {
    const categories = useCategoriesQuery()
    const { register, handleSubmit, setError, control, formState: { errors, isSubmitting } } = useForm<ProductFormValues>({
        defaultValues,
        resolver: productResolver,
    })
    const image = useWatch({ control, name: 'image' })
    const imageSource = productSchema.shape.image.safeParse(image)
    async function submit(values: ProductFormValues) {
        if (!categories.data?.some((category) => category.id === values.categoryId)) {
            setError('categoryId', { message: 'Choose a category from the current list.' })
            return
        }
        try { await onSubmit(values) }
        catch (error) { setError('root', { message: apiErrorMessage(error) }) }
    }
    const errorMessage = (field: keyof ProductFormValues) => errors[field]
        ? <p id={field + '-error'} className="mt-2 text-sm text-red-700">{errors[field]?.message}</p>
        : null
    return <>
        {categories.isError && <ErrorState error={categories.error} onRetry={() => { void categories.refetch() }} />}
        {categories.isPending && <p role="status" className="mb-4 text-sm text-[#87635a]">Loading categories...</p>}
        <form noValidate onSubmit={handleSubmit(submit)} className="rounded-xl bg-white p-6 sm:p-8">
            <fieldset disabled={isSubmitting || categories.isPending || categories.isError} className="grid gap-6">
                <div>
                    <label htmlFor="name" className="field-label">Product name</label>
                    <input id="name" className="field-input" maxLength={100} autoComplete="off"
                        aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'name-error' : undefined} {...register('name')} />
                    {errorMessage('name')}
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                        <label htmlFor="price" className="field-label">Price (USD)</label>
                        <input id="price" className="field-input" type="number" inputMode="decimal" step="0.01" min="0.01" max="10000"
                            aria-invalid={Boolean(errors.price)} aria-describedby={errors.price ? 'price-error' : undefined} {...register('price', { valueAsNumber: true })} />
                        {errorMessage('price')}
                    </div>
                    <div>
                        <label htmlFor="categoryId" className="field-label">Category</label>
                        <select id="categoryId" className="field-input" aria-invalid={Boolean(errors.categoryId)}
                            aria-describedby={errors.categoryId ? 'categoryId-error' : undefined} {...register('categoryId')}>
                            <option value="">Select a category</option>
                            {categories.data?.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                        </select>
                        {errorMessage('categoryId')}
                    </div>
                </div>
                <div>
                    <label htmlFor="image" className="field-label">Product image</label>
                    <input id="image" className="field-input" type="text" list="product-image-options" maxLength={2048}
                        placeholder="https://example.com/my-dessert.jpg" autoComplete="off" spellCheck={false}
                        aria-invalid={Boolean(errors.image)}
                        aria-describedby={errors.image ? 'image-help image-error' : 'image-help'} {...register('image')} />
                    <datalist id="product-image-options">
                        {productImages.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                    </datalist>
                    <p id="image-help" className="mt-2 text-xs text-[#87635a]">Paste a direct image URL or a local path such as /assets/images/my-dessert.jpg. You can also choose an included image. One image is used on every screen.</p>
                    {errorMessage('image')}
                    {imageSource.success && <div className="mt-4 max-w-xs">
                        <p className="mb-2 text-sm text-[#87635a]">Image preview</p>
                        <ProductImage src={imageSource.data} alt="Product image preview" className="aspect-square w-full rounded-lg object-cover" />
                    </div>}
                </div>
                {errors.root && <p role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{errors.root.message}</p>}
                <div className="flex flex-wrap gap-3">
                    <button type="submit" className="button-primary">{isSubmitting ? 'Saving...' : submitLabel}</button>
                    <Link to="/admin/products" className="button-secondary">Cancel</Link>
                </div>
            </fieldset>
        </form>
    </>
}
