import test from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { once } from 'node:events'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { createRequire } from 'node:module'
import { JSONFilePreset } from 'lowdb/node'
import type { Product } from '../src/interfaces/product'
import { jsonServerAdapter } from './jsonServerTransport'

const require = createRequire(import.meta.url)

test('API integration with a disposable json-server database (' + (process.env.DESSERTS_TEST_HTTP === '1' ? 'HTTP socket' : 'in-process HTTP handler') + ')', async (t) => {
    const directory = await mkdtemp(join(resolve('node_modules/.tmp'), 'desserts-level3-test-'))
    assert.equal(dirname(directory), resolve('node_modules/.tmp'))
    const databaseFile = join(directory, 'db.json')
    const seed = JSON.parse(await readFile(resolve('db.json'), 'utf8'))
    const db = await JSONFilePreset(databaseFile, structuredClone(seed))
    const jsonServerRoot = dirname(require.resolve('json-server/package.json'))
    const { createApp } = await import(pathToFileURL(join(jsonServerRoot, 'lib/app.js')).href)
    const app = createApp(db)
    const server = createServer(app.handler.bind(app))
    const useHttp = process.env.DESSERTS_TEST_HTTP === '1'
    if (useHttp) {
        server.listen(0, '127.0.0.1')
        await once(server, 'listening')
        const address = server.address()
        assert.ok(address && typeof address !== 'string')
        process.env.DESSERTS_TEST_API_URL = 'http://127.0.0.1:' + address.port
    } else {
        process.env.DESSERTS_TEST_API_URL = 'http://127.0.0.1:3000'
    }
    const services = await import('../src/services/products')
    const { api } = await import('../src/services/api')
    if (!useHttp) api.defaults.adapter = jsonServerAdapter(app, (config) => api.getUri(config))
    let created: Product | undefined
    try {
        await t.test('categories are returned from their own endpoint', async () => {
            const categories = await services.getCategories()
            assert.equal(categories.length, 9)
            assert.equal(categories[0].name, 'Waffle')
        })
        await t.test('first page contains eight products and related category names', async () => {
            const result = await services.getProducts()
            assert.equal(result.data.length, 8)
            assert.equal(result.items, 9)
            assert.equal(result.pages, 2)
            assert.equal(result.next, 2)
            assert.equal(result.data[0].category?.name, 'Waffle')
        })
        await t.test('second page returns the final product and accurate page metadata', async () => {
            const result = await services.getProducts({ page: 2 })
            assert.equal(result.data.length, 1)
            assert.equal(result.data[0].id, '9')
            assert.equal(result.prev, 1)
            assert.equal(result.next, null)
        })
        await t.test('search and category are combined by the API', async () => {
            const found = await services.getProducts({ search: 'baklava', categoryId: 'category-5' })
            assert.equal(found.items, 1)
            assert.equal(found.data[0].name, 'Pistachio Baklava')
            const empty = await services.getProducts({ search: 'Baklava', categoryId: 'category-7' })
            assert.equal(empty.items, 0)
            assert.deepEqual(empty.data, [])
        })
        await t.test('POST persists a new product and GET retrieves its category relation', async () => {
            created = await services.createProduct({ name: 'Integration dessert', price: 2.35, categoryId: 'category-1', image: '/assets/images/image-waffle-desktop.jpg' })
            assert.ok(created.id)
            const fetched = await services.getProduct(created.id)
            assert.equal(fetched.name, 'Integration dessert')
            assert.equal(fetched.category?.name, 'Waffle')
            const disk = JSON.parse(await readFile(databaseFile, 'utf8'))
            assert.ok(disk.products.some((item: Product) => item.id === created?.id))
        })
        await t.test('PUT replaces the saved values and related category', async () => {
            assert.ok(created)
            const updated = await services.updateProduct(created.id, { name: 'Updated integration dessert', price: 3.45, categoryId: 'category-7', image: '/assets/images/image-cake-desktop.jpg' })
            assert.equal(updated.price, 3.45)
            const fetched = await services.getProduct(created.id)
            assert.equal(fetched.name, 'Updated integration dessert')
            assert.equal(fetched.category?.name, 'Cake')
        })
        await t.test('DELETE removes the product from the saved database and GET becomes 404', async () => {
            assert.ok(created)
            await services.deleteProduct(created.id)
            await assert.rejects(services.getProduct(created.id), (error: unknown) => {
                return typeof error === 'object' && error !== null && 'response' in error
                    && (error.response as { status: number }).status === 404
            })
            const disk = JSON.parse(await readFile(databaseFile, 'utf8'))
            assert.equal(disk.products.length, 9)
            assert.ok(!disk.products.some((item: Product) => item.id === created?.id))
        })
        await t.test('out-of-range pages are clamped after list changes', async () => {
            const result = await services.getProducts({ page: 999 })
            assert.equal(result.prev, 1)
            assert.equal(result.last, 2)
            assert.equal(result.data[0].id, '9')
        })
        await t.test('cancelled requests do not reach the API', async () => {
            const controller = new AbortController()
            controller.abort()
            await assert.rejects(services.getProducts({}, controller.signal), (error: unknown) => {
                return error instanceof Error && error.name === 'CanceledError'
            })
        })
    } finally {
        if (useHttp) await new Promise<void>((resolveClose, rejectClose) => server.close((error) => error ? rejectClose(error) : resolveClose()))
        assert.equal(dirname(directory), resolve('node_modules/.tmp'))
        await rm(directory, { recursive: true })
    }
})

test('cart behavior and localStorage persistence', async (t) => {
    const values = new Map<string, string>()
    Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
        getItem: (key: string) => values.get(key) ?? null,
        setItem: (key: string, value: string) => { values.set(key, value) },
        removeItem: (key: string) => { values.delete(key) },
    } })
    const { useCartStore, MAX_QUANTITY } = await import('../src/stores/cartStore')
    const { cartCount, cartTotal } = await import('../src/interfaces/cart')
    const first: Product = { id: 'test-1', name: 'Test dessert one', price: 0.1, categoryId: 'category-1', image: '/assets/images/image-waffle-desktop.jpg' }
    const second: Product = { ...first, id: 'test-2', name: 'Test dessert two', price: 0.2 }
    await t.test('adding, increasing, decreasing and removing update the same cart', () => {
        useCartStore.getState().clear()
        useCartStore.getState().add(first)
        useCartStore.getState().add(first)
        assert.equal(cartCount(useCartStore.getState().items), 2)
        useCartStore.getState().decrease(first.id)
        assert.equal(useCartStore.getState().items[0].quantity, 1)
        useCartStore.getState().decrease(first.id)
        assert.deepEqual(useCartStore.getState().items, [])
        useCartStore.getState().add(first)
        useCartStore.getState().remove(first.id)
        assert.deepEqual(useCartStore.getState().items, [])
    })
    await t.test('monetary totals are calculated in cents', () => {
        useCartStore.getState().add(first)
        useCartStore.getState().add(second)
        assert.equal(cartTotal(useCartStore.getState().items), 0.3)
    })
    await t.test('rehydration restores the persisted quantities', async () => {
        const saved = values.get('desserts-cart')
        assert.ok(saved)
        useCartStore.getState().clear()
        values.set('desserts-cart', saved)
        await useCartStore.persist.rehydrate()
        assert.equal(cartCount(useCartStore.getState().items), 2)
        assert.equal(cartTotal(useCartStore.getState().items), 0.3)
    })
    await t.test('invalid persisted quantities do not enter the cart', async () => {
        useCartStore.getState().clear()
        values.set('desserts-cart', JSON.stringify({ state: { items: [{ product: first, quantity: -5 }] }, version: 1 }))
        await useCartStore.persist.rehydrate()
        assert.deepEqual(useCartStore.getState().items, [])
    })
    await t.test('quantities are bounded and price changes refresh existing snapshots', () => {
        for (let count = 0; count < MAX_QUANTITY + 5; count++) useCartStore.getState().add(first)
        assert.equal(useCartStore.getState().items[0].quantity, MAX_QUANTITY)
        useCartStore.getState().refreshProduct({ ...first, price: 0.5 })
        assert.equal(cartTotal(useCartStore.getState().items), MAX_QUANTITY * 0.5)
        useCartStore.getState().clear()
        assert.equal(JSON.parse(values.get('desserts-cart') ?? '{}').state.items.length, 0)
    })
})

test('Zod validation shared by creation and editing', async () => {
    const { productSchema, productResolver } = await import('../src/schemas/product')
    const valid = { name: '  Test dessert  ', price: 6.5, categoryId: 'category-1', image: '/assets/images/image-waffle-desktop.jpg' }
    assert.equal(productSchema.parse(valid).name, 'Test dessert')
    for (const price of [0, -1, NaN, Infinity, 1.234, 10000.01]) {
        assert.equal(productSchema.safeParse({ ...valid, price }).success, false)
    }
    assert.equal(productSchema.safeParse({ ...valid, name: 'x', categoryId: '' }).success, false)
    assert.equal(productSchema.safeParse({ ...valid, image: 'https://example.com/image.jpg' }).success, false)
    const validation = await productResolver({ ...valid, name: '', price: 0, categoryId: '' }, undefined, { fields: {}, shouldUseNativeValidation: false })
    assert.ok(validation.errors.name)
    assert.ok(validation.errors.price)
    assert.ok(validation.errors.categoryId)
})
