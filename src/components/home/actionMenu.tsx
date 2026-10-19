'use client'

import { IconDots } from '@tabler/icons-react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { TreatmentType } from '@/lib/db/treatments'

interface ActionMenuProps {
  treatment: TreatmentType
  onEdit: (treatment: TreatmentType) => void
  onDelete: (uid: string) => void
}

export default function ActionMenu({
  treatment,
  onEdit,
  onDelete,
}: ActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  // Track if component is mounted (for portal)
  useEffect(() => {
    setMounted(true)
  }, [])

  // Calculate menu position when opening
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setMenuPosition({
        top: rect.bottom + 4,
        left: rect.right - 128, // 128px = w-32 menu width
      })
    }
  }, [isOpen])

  // Close menu when clicking outside
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setIsOpen(false)
      }
    }

    // Close on scroll to prevent menu from floating away
    const handleScroll = () => setIsOpen(false)

    document.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('scroll', handleScroll, true)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('scroll', handleScroll, true)
    }
  }, [isOpen])

  const handleEdit = () => {
    setIsOpen(false)
    // Trigger edit immediately; click handlers will stop propagation.
    onEdit(treatment)
  }

  const handleDelete = () => {
    setIsOpen(false)
    if (treatment.uid) {
      onDelete(treatment.uid)
    }
  }

  const menu =
    isOpen && mounted ? (
      <div
        ref={menuRef}
        className='fixed z-[9999] w-32 rounded-2xl border border-line bg-white py-1 shadow-lg'
        style={{ top: menuPosition.top, left: menuPosition.left }}
      >
        <button
          type='button'
          className='block w-full cursor-pointer px-4 py-2 text-left text-sm text-ink hover:bg-paper'
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handleEdit()
          }}
        >
          Update
        </button>
        <button
          type='button'
          className='block w-full cursor-pointer px-4 py-2 text-left text-sm text-primary-700 hover:bg-primary-50'
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handleDelete()
          }}
        >
          Delete
        </button>
      </div>
    ) : null

  return (
    <>
      <button
        ref={buttonRef}
        type='button'
        className='cursor-pointer p-1 text-slate hover:text-ink'
        aria-label='Treatment actions'
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      >
        <IconDots size={16} />
      </button>

      {menu && createPortal(menu, document.body)}
    </>
  )
}
