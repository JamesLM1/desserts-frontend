import { useEffect } from 'react'
import { useToastStore } from '../stores/toastStore'
import type { ToastMessage } from '../stores/toastStore'

function Toast({ toast }: { toast: ToastMessage }) {
    const dismiss = useToastStore((state) => state.dismiss)
    useEffect(() => {
        const timer = setTimeout(() => dismiss(toast.id), 6500)
        return () => clearTimeout(timer)
    }, [dismiss, toast.id])
    return (
        <div role={toast.tone === 'error' ? 'alert' : 'status'}
            className={'flex items-start gap-4 rounded-xl border bg-white p-4 shadow-lg ' + (toast.tone === 'error' ? 'border-red-300' : 'border-green-300')}>
            <p className="flex-1 text-sm font-semibold">{toast.message}</p>
            <button type="button" onClick={() => dismiss(toast.id)} aria-label="Dismiss notification"
                className="rounded px-2 text-lg text-[#87635a] hover:text-[#c73a0f]">×</button>
        </div>
    )
}

export default function ToastHost() {
    const messages = useToastStore((state) => state.messages)
    return <div aria-label="Notifications" className="fixed right-4 bottom-4 z-50 grid w-[calc(100%-2rem)] max-w-sm gap-3">
        {messages.map((toast) => <Toast key={toast.id} toast={toast} />)}
    </div>
}
