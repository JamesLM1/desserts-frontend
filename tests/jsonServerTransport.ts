import { IncomingMessage, ServerResponse } from 'node:http'
import { Duplex } from 'node:stream'
import { AxiosError, AxiosHeaders } from 'axios'
import type { AxiosAdapter, AxiosRequestConfig, AxiosResponse } from 'axios'

interface Application {
    handler: (request: IncomingMessage, response: ServerResponse) => void
}

function decodeChunked(input: Buffer) {
    const chunks: Buffer[] = []
    let offset = 0
    while (offset < input.length) {
        const end = input.indexOf('\r\n', offset)
        if (end === -1) throw new Error('Invalid chunked response')
        const length = Number.parseInt(input.subarray(offset, end).toString(), 16)
        if (length === 0) break
        if (!Number.isFinite(length)) throw new Error('Invalid chunk length')
        offset = end + 2
        chunks.push(input.subarray(offset, offset + length))
        offset += length + 2
    }
    return Buffer.concat(chunks)
}

// Run the actual HTTP middleware, body parser, routes and disk writes without
// opening a socket. The optional test:http script uses Axios' normal HTTP adapter.
export function jsonServerAdapter(app: Application, getUri: (config: AxiosRequestConfig) => string): AxiosAdapter {
    return (config) => new Promise((resolveResponse, reject) => {
        const timeout = setTimeout(() => reject(new Error('The in-process API did not respond within 10 seconds')), 10_000)
        const wire: Buffer[] = []
        const socket = new Duplex({
            read() {},
            write(chunk, _encoding, callback) { wire.push(Buffer.from(chunk)); callback() },
        })
        const request = new IncomingMessage(socket)
        request.complete = true
        const url = new URL(getUri(config))
        request.method = (config.method ?? 'get').toUpperCase()
        request.url = url.pathname + url.search
        request.headers = Object.fromEntries(Object.entries(AxiosHeaders.from(config.headers).toJSON()).map(([key, value]) => [key.toLowerCase(), String(value)]))
        const body = typeof config.data === 'string' ? Buffer.from(config.data) : Buffer.alloc(0)
        if (body.length) request.headers['content-length'] = String(body.length)
        const response = new ServerResponse(request)
        response.assignSocket(socket)
        response.on('error', reject)
        response.on('finish', () => {
            clearTimeout(timeout)
            const raw = Buffer.concat(wire)
            const headerEnd = raw.indexOf('\r\n\r\n')
            let responseBody = raw.subarray(headerEnd + 4)
            if (response.getHeader('transfer-encoding') === 'chunked') responseBody = decodeChunked(responseBody)
            const result: AxiosResponse = {
                data: responseBody.toString('utf8'),
                status: response.statusCode,
                statusText: response.statusMessage,
                headers: AxiosHeaders.from(response.getHeaders()),
                config,
                request,
            }
            if (!config.validateStatus || config.validateStatus(result.status)) resolveResponse(result)
            else reject(new AxiosError('Request failed with status code ' + result.status, AxiosError.ERR_BAD_RESPONSE, config, request, result))
        })
        app.handler(request, response)
        if (body.length) request.push(body)
        request.push(null)
    })
}
