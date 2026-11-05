import { isAxiosError } from 'axios'
import { Link, useNavigate, useParams } from 'react-router'
import ProductForm from '../components/ProductForm'
import ErrorState from '../components/ErrorState'
import { useProductQuery } from '../hooks/useProductsQueries'
import { useProductsMutations } from '../hooks/useProductsMutations'

export default function ProductEditPage() {
    const { id = '' } = useParams()
    const product = useProductQuery(id)
    const { update } = useProductsMutations()
    const navigate = useNavigate()
    const isNotFound = !id || (isAxiosError(product.error) && product.error.response?.status === 404)
    return <main className="mx-auto min-h-screen max-w-3xl px-6 py-8">
        <h1 className="mb-8 text-3xl font-bold">Edit product</h1>
        {isNotFound ? <section className="rounded-xl bg-white p-8 text-center">
            <h2 className="text-4xl font-bold text-[#c73a0f]">404</h2><p className="mt-4">Product not found.</p>
            <Link to="/admin/products" className="button-secondary mt-4">Back to products</Link>
        </section> : <>
            {product.isPending && <p role="status" className="rounded-xl bg-white p-8">Loading product...</p>}
            {product.isError && <ErrorState error={product.error} onRetry={() => { void product.refetch() }} />}
            {product.isSuccess && <ProductForm key={product.data.id}
                defaultValues={{ name: product.data.name, price: product.data.price, categoryId: product.data.categoryId, image: product.data.image }}
                submitLabel="Save changes" onSubmit={async (values) => {
                    await update.mutateAsync({ id, product: values })
                    navigate('/admin/products')
                }} />}
        </>}
    </main>
}
