import Dialog from './Dialog'
import { apiErrorMessage } from '../services/errors'
import type { Product } from '../interfaces/product'

interface DeleteProductDialogProps {
    product: Product | null
    isPending: boolean
    error: unknown
    onClose: () => void
    onDelete: () => void
}

export default function DeleteProductDialog({ product, isPending, error, onClose, onDelete }: DeleteProductDialogProps) {
    return <Dialog isOpen={product !== null} onClose={() => { if (!isPending) onClose() }}
        labelledBy="delete-title" describedBy="delete-description"
        className="inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-xl p-6 sm:p-8">
        <h2 id="delete-title" className="text-2xl font-bold">Delete product?</h2>
        <p id="delete-description" className="mt-4 text-sm leading-6 text-[#87635a]">
            Delete <strong className="text-[#260f08]">{product?.name}</strong>? This also removes it from your cart.
        </p>
        {error && <p role="alert" className="mt-4 text-sm text-red-700">{apiErrorMessage(error)}</p>}
        <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" disabled={isPending} onClick={onClose} className="button-secondary">Cancel</button>
            <button type="button" disabled={isPending} onClick={onDelete} className="button-primary">{isPending ? 'Deleting...' : 'Delete product'}</button>
        </div>
    </Dialog>
}
