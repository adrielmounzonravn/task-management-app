import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import styles from '@/shared/ui/Modal/Modal.module.css'

type ModalProps = {
  open: boolean
  onClose: () => void
  labelledBy: string
  children: ReactNode
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'

export function Modal({ open, onClose, labelledBy, children }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<Element | null>(null)

  useEffect(() => {
    if (!open) return

    triggerRef.current = document.activeElement
    const dialog = dialogRef.current
    const focusable = dialog?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
    focusable?.[0]?.focus()

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (event.key !== 'Tab' || !dialog) return

      const focusableElements = dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      if (focusableElements.length === 0) return

      const first = focusableElements[0]
      const last = focusableElements[focusableElements.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      if (triggerRef.current instanceof HTMLElement) {
        triggerRef.current.focus()
      }
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className={styles.overlay} onMouseDown={onClose}>
      <div
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        onMouseDown={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body,
  )
}
