import { useState } from 'react'
import Header from './components/Header'
import CartDrawer from './components/CartDrawer'
import ProductCard from './components/ProductCard'
import { products } from './data/products'

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false)

  return (
    <>
      <main className="mx-auto min-h-screen max-w-7xl px-6 py-8 sm:px-10 lg:py-20">
        <section
          aria-labelledby="desserts-title"
          className="max-w-[800px]"
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
        </section>
      </main>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </>
  )
}

export default App