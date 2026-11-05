import { isAxiosError } from 'axios'

export function apiErrorMessage(error: unknown): string {
    if (isAxiosError(error)) {
        if (!error.response) return 'Cannot reach the local API. Start json-server with npm run api and try again. For the hosted website, allow local network access when your browser asks.'
        if (error.response.status === 404) return 'This product no longer exists. Refresh the list and try again.'
        if (error.response.status >= 500) return 'The API could not complete the request. Please try again.'
    }
    return 'The request could not be completed. Please try again.'
}
