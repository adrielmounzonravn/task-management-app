import styles from '@/shared/ui/EmptyState/EmptyState.module.css'

export function EmptyState({ message }: { message: string }) {
  return <p className={styles.emptyState}>{message}</p>
}
