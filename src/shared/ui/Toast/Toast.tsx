import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { CloseIcon } from '@/shared/ui/icons'
import styles from '@/shared/ui/Toast/Toast.module.css'

type ToastType = 'success' | 'error'

type ToastProps = {
  open: boolean
  message: string
  type?: ToastType
  onDismiss: () => void
  duration?: number
}

const DEFAULT_DURATION = 4000

export function Toast({
  open,
  message,
  type = 'success',
  onDismiss,
  duration = DEFAULT_DURATION,
}: ToastProps) {
  useEffect(() => {
    if (!open) return

    const timer = window.setTimeout(onDismiss, duration)
    return () => window.clearTimeout(timer)
  }, [open, message, duration, onDismiss])

  if (!open) return null

  return createPortal(
    <div
      className={`${styles.toast} ${type === 'error' ? styles.error : styles.success}`}
      role="status"
      aria-live="polite"
    >
      <span className={styles.message}>{message}</span>
      <button
        type="button"
        className={styles.closeButton}
        aria-label="Dismiss notification"
        onClick={onDismiss}
      >
        <CloseIcon />
      </button>
    </div>,
    document.body,
  )
}

type ToastState = {
  open: boolean
  message: string
  type: ToastType
}

const INITIAL_STATE: ToastState = { open: false, message: '', type: 'success' }

export function useToast() {
  const [toast, setToast] = useState<ToastState>(INITIAL_STATE)

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    setToast({ open: true, message, type })
  }, [])

  const hideToast = useCallback(() => {
    setToast((current) => ({ ...current, open: false }))
  }, [])

  return { toast, showToast, hideToast }
}
