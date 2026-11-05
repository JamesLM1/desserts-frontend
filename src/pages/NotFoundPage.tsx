import { Link } from 'react-router'

export default function NotFoundPage() {
    return <main className="mx-auto flex min-h-[70vh] max-w-5xl flex-col items-center justify-center px-6 py-12 text-center">
        <h1 className="text-5xl font-bold text-[#c73a0f]">404</h1><p className="mt-4 text-xl font-semibold">Page not found</p>
        <Link to="/" className="button-primary mt-6">Back to desserts</Link>
    </main>
}
