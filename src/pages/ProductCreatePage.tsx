import { useNavigate } from 'react-router'
import ProductForm from '../components/ProductForm'
import { useProductsMutations } from '../hooks/useProductsMutations'
import type { ProductFormValues } from '../schemas/product'

const defaultValues: ProductFormValues = {
    name: '', price: 0, categoryId: '', image: '/assets/images/image-waffle-desktop.jpg',
}

export default function ProductCreatePage() {
    const { create } = useProductsMutations()
    const navigate = useNavigate()
    return <main className="mx-auto min-h-screen max-w-3xl px-6 py-8">
        <h1 className="mb-8 text-3xl font-bold">New product</h1>
        <ProductForm defaultValues={defaultValues} submitLabel="Create product" onSubmit={async (values) => {
            await create.mutateAsync(values)
            navigate('/admin/products')
        }} />
    </main>
}
