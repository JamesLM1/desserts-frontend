import { useCallback, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router'

export function useCatalogFilters() {
    const [params, setParams] = useSearchParams()
    const latestParams = useRef(params)
    useEffect(() => { latestParams.current = params }, [params])
    const search = params.get('search') ?? ''
    const categoryId = params.get('categoryId') ?? ''
    const rawPage = params.get('page') ?? '1'
    const page = /^[1-9]\d*$/.test(rawPage) && Number.isSafeInteger(Number(rawPage)) ? Number(rawPage) : 1
    // Router URL updates are navigations, not queued React state updates. Keep
    // consecutive control changes together even before the next render commits.
    const updateFilter = useCallback((name: 'search' | 'categoryId', value: string) => {
        const next = new URLSearchParams(latestParams.current)
        if (value) next.set(name, value)
        else next.delete(name)
        next.delete('page')
        latestParams.current = next
        setParams(next, { replace: true })
    }, [setParams])
    const setPage = useCallback((value: number) => {
        const next = new URLSearchParams(latestParams.current)
        if (value > 1) next.set('page', String(value))
        else next.delete('page')
        latestParams.current = next
        setParams(next)
    }, [setParams])
    return { search, categoryId, page, updateFilter, setPage }
}
