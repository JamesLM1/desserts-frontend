import { useCallback } from 'react'
import { useSearchParams } from 'react-router'

export function useCatalogFilters() {
    const [params, setParams] = useSearchParams()
    const search = params.get('search') ?? ''
    const categoryId = params.get('categoryId') ?? ''
    const rawPage = params.get('page') ?? '1'
    const page = /^[1-9]\d*$/.test(rawPage) && Number.isSafeInteger(Number(rawPage)) ? Number(rawPage) : 1
    const updateFilter = useCallback((name: 'search' | 'categoryId', value: string) => {
        setParams((previous) => {
            const next = new URLSearchParams(previous)
            if (value) next.set(name, value)
            else next.delete(name)
            next.delete('page')
            return next
        }, { replace: true })
    }, [setParams])
    const setPage = useCallback((value: number) => {
        setParams((previous) => {
            const next = new URLSearchParams(previous)
            if (value > 1) next.set('page', String(value))
            else next.delete('page')
            return next
        })
    }, [setParams])
    return { search, categoryId, page, updateFilter, setPage }
}
