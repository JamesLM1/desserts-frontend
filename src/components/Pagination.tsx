import { useEffect } from 'react'
import type { ProductPage } from '../interfaces/product'

interface PaginationProps {
    data: ProductPage
    requestedPage: number
    onChange: (page: number) => void
    disabled?: boolean
}

export default function Pagination({ data, requestedPage, onChange, disabled = false }: PaginationProps) {
    const currentPage = data.prev === null ? 1 : data.prev + 1
    useEffect(() => {
        if (requestedPage > data.pages) onChange(data.pages)
    }, [requestedPage, data.pages, onChange])
    return <nav aria-label="Product pagination" className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <p aria-live="polite" className="text-sm text-[#87635a]">Page {currentPage} of {data.pages} · {data.items} products</p>
        <div className="flex gap-2">
            <button type="button" disabled={disabled || data.prev === null} onClick={() => { if (data.prev !== null) onChange(data.prev) }} className="button-secondary">Previous</button>
            <button type="button" disabled={disabled || data.next === null} onClick={() => { if (data.next !== null) onChange(data.next) }} className="button-secondary">Next</button>
        </div>
    </nav>
}
