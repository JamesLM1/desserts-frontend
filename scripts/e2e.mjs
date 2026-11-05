import { chromium, expect } from '@playwright/test'
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { copyFile, mkdtemp, mkdir, readFile, rm } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { setTimeout as pause } from 'node:timers/promises'

const temporaryRoot = resolve('node_modules/.tmp')
await mkdir(temporaryRoot, { recursive: true })
const fixture = await mkdtemp(resolve(temporaryRoot, 'desserts-browser-'))
const database = resolve(fixture, 'db.json')
const results = resolve(temporaryRoot, 'level3-browser-results')
await mkdir(results, { recursive: true })
await copyFile('db.json', database)
const servers = []
let browser
let page
let stage = 'startup'
function server(script, args) {
    const child = spawn(process.execPath, [resolve(script), ...args], { stdio: ['ignore', 'pipe', 'pipe'] })
    let output = ''
    child.stdout.on('data', (chunk) => { output += chunk })
    child.stderr.on('data', (chunk) => { output += chunk })
    servers.push(child)
    return { child, output: () => output }
}
async function ready(url, process) {
    for (let attempt = 0; attempt < 80; attempt++) {
        if (process.child.exitCode !== null) throw new Error(process.output())
        try { if ((await fetch(url)).ok) return } catch { /* Wait for startup. */ }
        await pause(250)
    }
    throw new Error('Server did not start: ' + url + '\n' + process.output())
}
function passed(message) { console.log('PASS: ' + message) }
try {
    const api = server('node_modules/json-server/lib/bin.js', [database, '--port', '3000'])
    const frontend = server('node_modules/vite/bin/vite.js', ['preview', '--port', '5173', '--strictPort', '--host', '127.0.0.1'])
    await Promise.all([ready('http://localhost:3000/categories', api), ready('http://127.0.0.1:5173', frontend)])
    browser = await chromium.launch({ headless: true })
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
    page = await context.newPage()
    page.setDefaultTimeout(15_000)
    const errors = []
    const requests = []
    page.on('pageerror', (error) => errors.push(error.message))
    page.on('request', (request) => { if (request.url().includes('localhost:3000/products')) requests.push(request.url()) })
    const base = 'http://127.0.0.1:5173'
    const pagination = () => page.getByRole('navigation', { name: 'Product pagination' })
    const cartButton = (count) => page.getByRole('button', { name: 'Cart (' + count + ')', exact: true })
    const productCard = (name) => page.locator('main article').filter({ has: page.getByRole('heading', { name, exact: true }) })

    stage = 'catalog'
    await page.goto(base)
    await expect(page.getByText('Loading products...', { exact: true })).toBeVisible()
    await expect(pagination()).toContainText('Page 1 of 2')
    await expect(page.locator('main article')).toHaveCount(8)
    const cards = await page.locator('main article').all()
    const positions = await Promise.all(cards.slice(0, 3).map((card) => card.boundingBox()))
    assert(positions[0].x < positions[1].x && positions[1].x < positions[2].x)
    assert(Math.abs(positions[0].y - positions[2].y) < 2)
    await page.screenshot({ path: resolve(results, 'desktop.png'), fullPage: true })
    await page.getByRole('button', { name: 'Next', exact: true }).click()
    await expect(pagination()).toContainText('Page 2 of 2')
    await expect(page.getByRole('heading', { name: 'Vanilla Panna Cotta', exact: true })).toBeVisible()
    await page.getByRole('button', { name: 'Previous', exact: true }).click()
    await expect(pagination()).toContainText('Page 1 of 2')
    await page.getByRole('searchbox', { name: 'Search desserts' }).fill('Baklava')
    await expect(page.locator('main article')).toHaveCount(1)
    await expect(page.getByRole('heading', { name: 'Pistachio Baklava', exact: true })).toBeVisible()
    await page.getByRole('combobox', { name: 'Category', exact: true }).selectOption('category-7')
    await expect(page.getByText('No desserts found.', { exact: true })).toBeVisible()
    assert(requests.some((url) => new URL(url).searchParams.get('name:contains') === 'Baklava' && new URL(url).searchParams.get('categoryId') === 'category-7'))
    assert(requests.some((url) => new URL(url).searchParams.get('_per_page') === '8'))
    await page.getByRole('searchbox', { name: 'Search desserts' }).fill('')
    await page.getByRole('combobox', { name: 'Category', exact: true }).selectOption('')
    await expect(pagination()).toContainText('Page 1 of 2')
    passed('skeleton, eight products, desktop columns, pagination and server-side filters')

    stage = 'cart'
    await page.getByRole('button', { name: 'Add Waffle with Berries to cart', exact: true }).click()
    await productCard('Waffle with Berries').getByRole('button', { name: 'Increase quantity of Waffle with Berries', exact: true }).click()
    await page.getByRole('button', { name: 'Add Macaron Mix of Five to cart', exact: true }).click()
    await expect(cartButton(3)).toBeVisible()
    await page.reload()
    await expect(cartButton(3)).toBeVisible()
    await cartButton(3).click()
    const drawer = page.getByRole('dialog', { name: 'Your Cart (3)', exact: true })
    await expect(drawer).toContainText('$21.00')
    await drawer.getByRole('button', { name: 'Decrease quantity of Waffle with Berries', exact: true }).click()
    await expect(page.getByRole('dialog')).toContainText('$14.50')
    await page.getByRole('dialog').getByRole('button', { name: 'Increase quantity of Waffle with Berries', exact: true }).click()
    await page.getByRole('dialog').getByRole('button', { name: 'Remove Macaron Mix of Five from cart', exact: true }).click()
    await expect(page.getByRole('dialog')).toContainText('$13.00')
    await page.getByRole('button', { name: 'Close cart', exact: true }).click()
    await expect(cartButton(2)).toBeFocused()
    await page.getByRole('button', { name: 'Add Macaron Mix of Five to cart', exact: true }).click()
    await cartButton(3).click()
    await page.getByRole('dialog').getByRole('button', { name: 'Confirm Order', exact: true }).click()
    const order = page.getByRole('dialog', { name: 'Order Confirmed', exact: true })
    await expect(order).toBeVisible()
    await expect(order).toContainText('Waffle with Berries')
    await expect(order).toContainText('$21.00')
    await page.screenshot({ path: resolve(results, 'order.png'), fullPage: true })
    await order.getByRole('button', { name: 'Start New Order', exact: true }).click()
    await page.reload()
    await expect(cartButton(0)).toBeVisible()
    passed('cart add/increase/decrease/remove, totals, persistence, drawer focus and real order clearing')

    stage = 'detail'
    await page.getByRole('heading', { name: 'Waffle with Berries', exact: true }).getByRole('link').click()
    await expect(page.getByRole('heading', { name: 'Waffle with Berries', exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Add to Cart', exact: true })).toBeVisible()
    await page.goto(base + '/producto/missing-product')
    await expect(page.getByRole('heading', { name: '404', exact: true })).toBeVisible()
    passed('detail navigation and product 404')

    stage = 'CRUD'
    await page.goto(base + '/admin/products')
    await page.getByRole('link', { name: 'New product', exact: true }).click()
    const create = page.getByRole('button', { name: 'Create product', exact: true })
    await expect(create).toBeEnabled()
    await create.click()
    await expect(page.getByText('Enter at least 3 characters.', { exact: true })).toBeVisible()
    await expect(page.getByText('Price must be greater than zero.', { exact: true })).toBeVisible()
    await page.getByLabel('Product name', { exact: true }).fill('Evaluation Cake')
    await page.getByLabel('Price (USD)', { exact: true }).fill('4.75')
    await page.getByLabel('Category', { exact: true }).selectOption('category-7')
    await create.click()
    await expect(page.getByRole('heading', { name: 'Product management', exact: true })).toBeVisible()
    await expect(page.getByText('Product created successfully.', { exact: true })).toBeVisible()
    await page.getByRole('searchbox', { name: 'Search desserts' }).fill('Evaluation Cake')
    const createdRow = page.getByRole('row').filter({ hasText: 'Evaluation Cake' })
    await expect(createdRow).toContainText('Cake')
    await expect(createdRow).toContainText('$4.75')
    const saved = JSON.parse(await readFile(database, 'utf8')).products.find((product) => product.name === 'Evaluation Cake')
    assert(saved?.id)
    await createdRow.getByRole('link', { name: 'Evaluation Cake', exact: true }).click()
    await page.getByRole('button', { name: 'Add to Cart', exact: true }).click()
    await page.getByRole('link', { name: 'Edit this product', exact: true }).click()
    await expect(page.getByLabel('Product name', { exact: true })).toHaveValue('Evaluation Cake')
    await expect(page.getByLabel('Price (USD)', { exact: true })).toHaveValue('4.75')
    await expect(page.getByLabel('Category', { exact: true })).toHaveValue('category-7')
    await page.getByLabel('Product name', { exact: true }).fill('Evaluation Cake Edited')
    await page.getByLabel('Price (USD)', { exact: true }).fill('6')
    await page.getByRole('button', { name: 'Save changes', exact: true }).click()
    await expect(page.getByText('Product updated successfully.', { exact: true })).toBeVisible()
    await page.getByRole('searchbox', { name: 'Search desserts' }).fill('Evaluation Cake Edited')
    const editedRow = page.getByRole('row').filter({ hasText: 'Evaluation Cake Edited' })
    await expect(editedRow).toContainText('$6.00')
    await cartButton(1).click()
    await expect(page.getByRole('dialog')).toContainText('Evaluation Cake Edited')
    await expect(page.getByRole('dialog')).toContainText('$6.00')
    await page.getByRole('button', { name: 'Close cart', exact: true }).click()
    await editedRow.getByRole('button', { name: 'Delete Evaluation Cake Edited', exact: true }).click()
    await page.getByRole('dialog').getByRole('button', { name: 'Cancel', exact: true }).click()
    await expect(editedRow).toBeVisible()
    await editedRow.getByRole('button', { name: 'Delete Evaluation Cake Edited', exact: true }).click()
    await page.getByRole('dialog').getByRole('button', { name: 'Delete product', exact: true }).click()
    await expect(page.getByText('Product deleted successfully.', { exact: true })).toBeVisible()
    await expect(editedRow).toHaveCount(0)
    await expect(cartButton(0)).toBeVisible()
    assert.equal(JSON.parse(await readFile(database, 'utf8')).products.some((product) => product.id === saved.id), false)
    passed('shared form validation/defaultValues, POST/PUT/DELETE persistence, toasts, cache invalidation and deletion confirmation')

    stage = 'last page deletion'
    await page.getByRole('searchbox', { name: 'Search desserts' }).fill('')
    await expect(pagination()).toContainText('Page 1 of 2')
    await page.getByRole('button', { name: 'Next', exact: true }).click()
    await expect(pagination()).toContainText('Page 2 of 2')
    await page.getByRole('button', { name: 'Delete Vanilla Panna Cotta', exact: true }).click()
    await page.getByRole('dialog').getByRole('button', { name: 'Delete product', exact: true }).click()
    await expect(pagination()).toContainText('Page 1 of 1')
    passed('deleting the last product on page two returns to a valid page')

    stage = 'mobile and API errors'
    const mobile = await browser.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true })
    const mobilePage = await mobile.newPage()
    await mobilePage.goto(base)
    await expect(mobilePage.getByRole('navigation', { name: 'Product pagination' })).toContainText('Page 1 of 1')
    const mobileCards = await mobilePage.locator('main article').all()
    const mobilePositions = await Promise.all(mobileCards.slice(0, 3).map((card) => card.boundingBox()))
    assert(Math.abs(mobilePositions[0].x - mobilePositions[2].x) < 2)
    assert(mobilePositions[0].y < mobilePositions[1].y && mobilePositions[1].y < mobilePositions[2].y)
    assert(await mobilePage.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
    await mobilePage.screenshot({ path: resolve(results, 'mobile.png'), fullPage: true })
    await mobile.close()
    await page.route('http://localhost:3000/**', (route) => route.abort())
    await page.goto(base + '/admin/products/new')
    await expect(page.getByText('We could not load this content.', { exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Create product', exact: true })).toBeDisabled()
    await page.unroute('http://localhost:3000/**')
    await page.getByRole('button', { name: 'Retry', exact: true }).click()
    await expect(page.getByRole('button', { name: 'Create product', exact: true })).toBeEnabled()
    assert.deepEqual(errors, [])
    passed('mobile single column without overflow, friendly API error and retry recovery; no JavaScript page errors')
} catch (error) {
    console.error('FAILED STAGE: ' + stage)
    if (page) await page.screenshot({ path: resolve(results, 'failure.png'), fullPage: true }).catch(() => {})
    throw error
} finally {
    if (browser) await browser.close()
    for (const child of servers) child.kill()
    if (dirname(fixture) !== temporaryRoot) throw new Error('Unexpected fixture directory')
    await rm(fixture, { recursive: true, force: true })
}
