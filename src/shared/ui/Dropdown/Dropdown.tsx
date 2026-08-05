import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { ReactNode, RefObject } from 'react'
import { createPortal } from 'react-dom'
import styles from '@/shared/ui/Dropdown/Dropdown.module.css'

const PANEL_ATTRIBUTE = 'data-dropdown-panel'

const openDropdowns = new Set<(open: boolean) => void>()

function closeOtherDropdowns(current: (open: boolean) => void) {
  openDropdowns.forEach((setOpen) => {
    if (setOpen !== current) setOpen(false)
  })
}

type DropdownContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
  triggerRef: RefObject<HTMLButtonElement | null>
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
  const [open, setOpenState] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  function setOpen(next: boolean) {
    if (next) closeOtherDropdowns(setOpenState)
    setOpenState(next)
  }

  useEffect(() => {
    if (!open) return

    openDropdowns.add(setOpenState)
    return () => {
      openDropdowns.delete(setOpenState)
    }
  }, [open])

  useEffect(() => {
    if (!open) return

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Element
      if (rootRef.current?.contains(target)) return
      if (target.closest(`[${PANEL_ATTRIBUTE}]`)) return
      setOpen(false)
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
    <DropdownContext.Provider value={{ open, setOpen, triggerRef }}>
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
  const { open, setOpen, triggerRef } = useDropdownContext()

  return (
    <button
      ref={triggerRef}
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
  children: ReactNode | ((close: () => void) => ReactNode)
}

Dropdown.Panel = function DropdownPanel({ children }: DropdownPanelProps) {
  const { open, setOpen, triggerRef } = useDropdownContext()
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null)

  useLayoutEffect(() => {
    if (!open) return

    function updatePosition() {
      const rect = triggerRef.current?.getBoundingClientRect()
      if (!rect) return
      setPosition({ top: rect.bottom + 4, left: rect.left })
    }

    updatePosition()
    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)
    return () => {
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [open, triggerRef])

  if (!open || !position) return null

  const content = typeof children === 'function' ? children(() => setOpen(false)) : children

  return createPortal(
    <div
      {...{ [PANEL_ATTRIBUTE]: true }}
      className={styles.panel}
      role="listbox"
      style={{ top: position.top, left: position.left }}
    >
      {content}
    </div>,
    document.body,
  )
}
