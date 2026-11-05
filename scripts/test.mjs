import { build } from 'vite'
import { spawn } from 'node:child_process'
import { resolve } from 'node:path'

const output = 'node_modules/.tmp/desserts-tests'
await build({
    configFile: false,
    logLevel: 'warn',
    define: {
        'import.meta.env.VITE_API_URL': 'process.env.DESSERTS_TEST_API_URL',
        'import.meta.env.VITE_API_DELAY_MS': '"0"',
    },
    build: {
        ssr: 'tests/level3.test.ts',
        outDir: output,
        emptyOutDir: true,
        minify: false,
        rollupOptions: { output: { entryFileNames: 'level3.test.mjs' } },
    },
})
const child = spawn(process.execPath, ['--test', '--test-concurrency=1', resolve(output, 'level3.test.mjs')], {
    stdio: 'inherit',
    env: { ...process.env, DESSERTS_TEST_HTTP: process.argv.includes('--http') ? '1' : '0' },
})
child.on('error', (error) => { console.error(error.message); process.exitCode = 1 })
child.on('exit', (code) => { process.exitCode = code ?? 1 })
