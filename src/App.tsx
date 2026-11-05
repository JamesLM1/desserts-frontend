import { useState } from 'react'
import Header from './components/Header'
import ProductCard from './components/ProductCard'
import CartSummary from './components/CartSummary'
import ConfirmOrderModal from './components/ConfirmOrderModal'
import { products } from './data/products'
import { cartPreviewItems } from './data/cartPreview'

// true: muestra el ejemplo con productos.
// false: muestra el carrito vacío.
const SHOW_CART_PREVIEW = true

const cartItems = SHOW_CART_PREVIEW ? cartPreviewItems : []

function App() {
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false)

  return (
    <>
      <main className="mx-auto min-h-screen max-w-[1440px] px-6 py-6 sm:px-10 sm:py-10 xl:px-28 xl:py-22">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_384px]">
          <section
            aria-labelledby="desserts-title"
            className="min-w-0"
          >
            <Header />

            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => {
                const quantity =
                  cartItems.find(
                    (item) => item.product.id === product.id,
                  )?.quantity ?? 0

                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    quantity={quantity}
                  />
                )
              })}
            </div>
          </section>

          <CartSummary
            items={cartItems}
            onConfirm={() => setIsConfirmationOpen(true)}
          />
        </div>
      </main>

      <ConfirmOrderModal
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
      />
    </>
  )
}

export default App