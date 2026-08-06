import { Modal } from '@/shared/ui/Modal/Modal'
import styles from '@/shared/ui/ConfirmModal/ConfirmModal.module.css'

type ConfirmModalProps = {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  loading?: boolean
}

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  loading = false,
}: ConfirmModalProps) {
  return (
    <Modal open={open} onClose={onClose} labelledBy="confirm-modal-title">
      <h2 id="confirm-modal-title" className={styles.title}>
        {title}
      </h2>
      <p className={styles.description}>{description}</p>
      <div className={styles.footer}>
        <button type="button" className={styles.cancel} onClick={onClose}>
          {cancelLabel}
        </button>
        <button type="button" className={styles.confirm} onClick={onConfirm} disabled={loading}>
          {confirmLabel}
        </button>
      </div>
    </Modal>
  )
}
