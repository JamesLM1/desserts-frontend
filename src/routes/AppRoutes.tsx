import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router'
import ShopLayout from '../components/ShopLayout'
import ProductsPage from '../pages/ProductsPage'
import ProductDetailPage from '../pages/ProductDetailPage'
import NotFoundPage from '../pages/NotFoundPage'

const AdminProductsPage = lazy(() => import('../pages/AdminProductsPage'))
const ProductCreatePage = lazy(() => import('../pages/ProductCreatePage'))
const ProductEditPage = lazy(() => import('../pages/ProductEditPage'))

export default function AppRoutes() {
    return <Suspense fallback={<p role="status" className="p-8 text-center">Loading page...</p>}>
        <Routes>
            <Route element={<ShopLayout />}>
                <Route path="/" element={<ProductsPage />} />
                <Route path="/producto/:id" element={<ProductDetailPage />} />
                <Route path="/admin/products" element={<AdminProductsPage />} />
                <Route path="/admin/products/new" element={<ProductCreatePage />} />
                <Route path="/admin/products/:id/edit" element={<ProductEditPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Route>
        </Routes>
    </Suspense>
}
