import { createContext, useContext, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import styles from '@/shared/ui/Dropdown/Dropdown.module.css'

type DropdownContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
}

const DropdownContext = createContext<DropdownContextValue | null>(null)

function useDropdownContext() {
  const context = useContext(DropdownContext)
  if (!context) {
    throw new Error('Dropdown compound components must be used within <Dropdown>')
  }
  return context
}

type DropdownProps = {
  children: ReactNode
}

export function Dropdown({ children }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    function handlePointerDown(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div className={styles.root} ref={rootRef}>
        {children}
      </div>
    </DropdownContext.Provider>
  )
}

type DropdownTriggerProps = {
  children: ReactNode
}

Dropdown.Trigger = function DropdownTrigger({ children }: DropdownTriggerProps) {
  const { open, setOpen } = useDropdownContext()

  return (
    <button
      type="button"
      className={styles.trigger}
      aria-expanded={open}
      onClick={() => setOpen(!open)}
    >
      {children}
    </button>
  )
}

type DropdownPanelProps = {
  children: ReactNode
}

Dropdown.Panel = function DropdownPanel({ children }: DropdownPanelProps) {
  const { open } = useDropdownContext()

  if (!open) return null

  return (
    <div className={styles.panel} role="listbox">
      {children}
    </div>
  )
}
