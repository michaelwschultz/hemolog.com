'use client'

import type { ReactNode } from 'react'

interface PopupProps {
  open: boolean
  title: string
  onClose: () => void
  children?: ReactNode
}

export function Popup({ open, title, onClose, children }: PopupProps) {
  if (!open) return null

  return (
    <div className='fixed inset-0 z-[80] flex items-end justify-center bg-ink/40 p-0 min-[800px]:items-center min-[800px]:p-4'>
      <div
        role='dialog'
        aria-modal='true'
        aria-label={title}
        className='flex max-h-[min(92dvh,100%)] w-full max-w-md flex-col overflow-hidden rounded-t-3xl bg-white shadow-xl min-[800px]:rounded-3xl'
      >
        <div className='flex shrink-0 items-center justify-between border-b border-line px-5 py-4'>
          <h2 className='m-0 text-lg font-semibold text-ink'>{title}</h2>
          <button
            type='button'
            className='btn btn-secondary btn-sm'
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className='min-h-0 flex-1 overflow-y-auto'>{children}</div>
      </div>
    </div>
  )
}
