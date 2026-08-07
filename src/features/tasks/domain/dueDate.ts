export type DueDateTone = 'overdue' | 'soon' | 'onTime'

const dayFormatter = new Intl.DateTimeFormat('en-US', { day: 'numeric', timeZone: 'UTC' })
const monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'long', timeZone: 'UTC' })
const yearFormatter = new Intl.DateTimeFormat('en-US', { year: 'numeric', timeZone: 'UTC' })

function startOfDayUtc(date: Date) {
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
}

export function formatDueDate(dueDate: string): { label: string; tone: DueDateTone } {
  const due = new Date(dueDate)
  const diffDays = Math.round((startOfDayUtc(due) - startOfDayUtc(new Date())) / 86_400_000)

  if (diffDays === 0) return { label: 'Today', tone: 'soon' }
  if (diffDays === -1) return { label: 'Yesterday', tone: 'overdue' }
  if (diffDays === 1) return { label: 'Tomorrow', tone: 'soon' }

  const label = `${dayFormatter.format(due)} ${monthFormatter.format(due)}, ${yearFormatter.format(due)}`
  return { label, tone: diffDays < 0 ? 'overdue' : 'onTime' }
}
