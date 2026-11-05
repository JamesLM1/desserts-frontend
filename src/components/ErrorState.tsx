import { apiErrorMessage } from '../services/errors'

export default function ErrorState({ error, onRetry }: { error: unknown; onRetry: () => void }) {
    return <section role="alert" className="rounded-xl bg-white p-6 text-center">
        <h2 className="text-xl font-bold">We could not load this content.</h2>
        <p className="mt-3 text-sm leading-6 text-[#87635a]">{apiErrorMessage(error)}</p>
        <button type="button" onClick={onRetry} className="button-primary mt-4">Retry</button>
    </section>
}
