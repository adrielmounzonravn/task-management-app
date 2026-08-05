import { useState } from 'react'
import { Dropdown } from '@/shared/ui/Dropdown/Dropdown'
import { ChevronLeftIcon, ChevronRightIcon, DueDateIcon } from '@/shared/ui/icons'
import styles from '@/shared/ui/DatePicker/DatePicker.module.css'

const WEEKDAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTH_LABELS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

function toDateString(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function parseDateString(value: string) {
  const parts = value.split('-')
  const year = Number(parts[0])
  const month = Number(parts[1])
  const day = Number(parts[2])
  return { year, month: month - 1, day }
}

function buildCalendarDays(year: number, month: number) {
  const firstWeekday = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  const days = []
  for (let i = firstWeekday - 1; i >= 0; i--) {
    days.push({ year, month: month - 1, day: daysInPrevMonth - i, inMonth: false })
  }
  for (let day = 1; day <= daysInMonth; day++) {
    days.push({ year, month, day, inMonth: true })
  }
  let nextMonthDay = 1
  while (days.length < 42) {
    days.push({ year, month: month + 1, day: nextMonthDay++, inMonth: false })
  }
  return days
}

type DatePickerProps = {
  value: string
  onChange: (value: string) => void
}

export function DatePicker({ value, onChange }: DatePickerProps) {
  const selected = parseDateString(value)
  const [view, setView] = useState({ year: selected.year, month: selected.month })
  const today = new Date()

  function changeMonth(delta: number) {
    const date = new Date(view.year, view.month + delta, 1)
    setView({ year: date.getFullYear(), month: date.getMonth() })
  }

  function changeYear(delta: number) {
    setView((current) => ({ year: current.year + delta, month: current.month }))
  }

  function selectToday() {
    onChange(toDateString(today.getFullYear(), today.getMonth(), today.getDate()))
    setView({ year: today.getFullYear(), month: today.getMonth() })
  }

  const days = buildCalendarDays(view.year, view.month)
  const label = new Date(selected.year, selected.month, selected.day).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })

  return (
    <Dropdown>
      <Dropdown.Trigger>
        <DueDateIcon />
        {label}
      </Dropdown.Trigger>
      <Dropdown.Panel>
        <div className={styles.calendar}>
          <div className={styles.header}>
            <button type="button" className={styles.navButton} onClick={() => changeYear(-1)}>
              «
            </button>
            <button type="button" className={styles.navButton} onClick={() => changeMonth(-1)}>
              <ChevronLeftIcon />
            </button>
            <span className={styles.title}>
              {MONTH_LABELS[view.month]} {view.year}
            </span>
            <button type="button" className={styles.navButton} onClick={() => changeMonth(1)}>
              <ChevronRightIcon />
            </button>
            <button type="button" className={styles.navButton} onClick={() => changeYear(1)}>
              »
            </button>
          </div>

          <div className={styles.grid}>
            {WEEKDAY_LABELS.map((label) => (
              <span key={label} className={styles.weekday}>
                {label}
              </span>
            ))}
            {days.map((cell) => {
              const dateString = toDateString(cell.year, cell.month, cell.day)
              const isToday =
                cell.year === today.getFullYear() &&
                cell.month === today.getMonth() &&
                cell.day === today.getDate()
              const isSelected = dateString === value

              return (
                <button
                  key={dateString}
                  type="button"
                  className={styles.day}
                  data-in-month={cell.inMonth}
                  data-today={isToday}
                  data-selected={isSelected}
                  onClick={() => onChange(dateString)}
                >
                  {cell.day}
                </button>
              )
            })}
          </div>

          <button type="button" className={styles.todayButton} onClick={selectToday}>
            Today
          </button>
        </div>
      </Dropdown.Panel>
    </Dropdown>
  )
}
