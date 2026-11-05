import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

interface DialogProps {
    isOpen: boolean
    onClose: () => void
    labelledBy: string
    describedBy?: string
    className?: string
    children: ReactNode
}

export default function Dialog({ isOpen, onClose, labelledBy, describedBy, className = '', children }: DialogProps) {
    const dialogRef = useRef<HTMLDialogElement>(null)
    useEffect(() => {
        const dialog = dialogRef.current
        if (!isOpen || !dialog) return
        const previousFocus = document.activeElement
        dialog.showModal()
        return () => {
            dialog.close()
            if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus()
        }
    }, [isOpen])
    if (!isOpen) return null
    return <dialog ref={dialogRef} onCancel={(event) => { event.preventDefault(); onClose() }}
        aria-labelledby={labelledBy} aria-describedby={describedBy}
        className={'fixed border-0 bg-white text-[#260f08] shadow-xl backdrop:bg-black/50 ' + className}>
        {children}
    </dialog>
}
