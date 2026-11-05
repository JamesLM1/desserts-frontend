import { create } from 'zustand'

export interface ToastMessage {
    id: number
    message: string
    tone: 'success' | 'error'
}

interface ToastState {
    messages: ToastMessage[]
    push: (message: string, tone?: ToastMessage['tone']) => void
    dismiss: (id: number) => void
}

let nextToastId = 0

export const useToastStore = create<ToastState>((set) => ({
    messages: [],
    push: (message, tone = 'success') => set((state) => ({
        messages: [...state.messages.slice(-2), { id: ++nextToastId, message, tone }],
    })),
    dismiss: (id) => set((state) => ({ messages: state.messages.filter((item) => item.id !== id) })),
}))

export function notify(message: string, tone: ToastMessage['tone'] = 'success') {
    useToastStore.getState().push(message, tone)
}
