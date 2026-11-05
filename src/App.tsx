import { Link, Route, Routes } from 'react-router'
import ProductsPage from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<ProductsPage />}
      />

      <Route
        path="/producto/:id"
        element={<ProductDetailPage />}
      />

      <Route
        path="*"
        element={
          <main className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 py-12 text-center">
            <h1 className="text-5xl font-bold text-[#c73a0f]">
              404
            </h1>

            <p className="mt-4 text-xl font-semibold">
              Page not found
            </p>

            <Link
              to="/"
              className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-[#c73a0f] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#952c0c] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c73a0f]"
            >
              Back to desserts
            </Link>
          </main>
        }
      />
    </Routes>
  )
}

export default App