import ProductCard from './components/ProductCard'
import { products } from './data/products'

function App() {
  return (
    <main className="mx-auto min-h-screen max-w-7xl px-6 py-8 sm:px-10 lg:py-20">
      <section
        aria-labelledby="desserts-title"
        className="max-w-[800px]"
      >
        <h1
          id="desserts-title"
          className="mb-8 text-[40px] font-bold leading-tight"
        >
          Desserts
        </h1>

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
  )
}

export default App