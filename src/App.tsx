import { useState } from 'react'
import Header from './components/Header'
import CartDrawer from './components/CartDrawer'
import ProductCard from './components/ProductCard'
import ConfirmOrderModal from './components/ConfirmOrderModal'
import { products } from './data/products'

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false)

  return (
    <>
      <main className="mx-auto min-h-screen max-w-7xl px-6 py-8 sm:px-10 lg:py-20">
        <section
          aria-labelledby="desserts-title"
          className="max-w-200"
        >
          <Header
            isCartOpen={isCartOpen}
            onOpenCart={() => setIsCartOpen(true)}
          />

          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => setIsConfirmationOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={isConfirmationOpen}
            className="mt-10 min-h-12 cursor-pointer rounded-full border border-[#c73a0f] bg-white px-6 py-3 text-sm font-semibold text-[#c73a0f] transition-colors hover:bg-[#c73a0f] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c73a0f]"
          >
            Preview order confirmation
          </button>
        </section>
      </main>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />

      <ConfirmOrderModal
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
      />
    </>
  )
}

export default App