import type React from 'react'
import { useState, useRef, useEffect } from 'react'

export type PopoverPlacement =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-start'
  | 'top-end'
  | 'bottom-start'
  | 'bottom-end'
  | 'left-start'
  | 'left-end'
  | 'right-start'
  | 'right-end'

export interface PopoverItemProps {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  title?: boolean
  line?: boolean
}

export interface PopoverContentProps {
  children: React.ReactNode
}

export interface PopoverProps {
  content: React.ReactNode
  children: React.ReactElement
  placement?: PopoverPlacement
  trigger?: 'click' | 'hover'
}

export function PopoverItem({
  children,
  onClick,
  disabled,
  title,
  line,
}: PopoverItemProps): JSX.Element {
  const baseClasses = 'w-full px-4 py-2 text-left text-sm transition-colors'

  const classes = title
    ? `${baseClasses} font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700`
    : line
      ? `${baseClasses} border-t border-gray-200 dark:border-gray-700`
      : disabled
        ? `${baseClasses} text-gray-400 dark:text-gray-500 cursor-not-allowed`
        : `${baseClasses} text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer`

  const handleClick = (): void => {
    if (!disabled && onClick) {
      onClick()
    }
  }

  return (
    <button
      className={classes}
      onClick={handleClick}
      disabled={disabled}
      type='button'
    >
      {children}
    </button>
  )
}

export function PopoverContent({ children }: PopoverContentProps): JSX.Element {
  return <div className='py-1'>{children}</div>
}

export function Popover({
  content,
  children,
  placement = 'bottom-end',
  trigger = 'click',
}: PopoverProps): JSX.Element {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const popoverRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleTriggerClick = (): void => {
    if (trigger === 'click') {
      setIsOpen(!isOpen)
    }
  }

  const handleTriggerMouseEnter = (): void => {
    if (trigger === 'hover') {
      setIsOpen(true)
    }
  }

  const handleTriggerMouseLeave = (): void => {
    if (trigger === 'hover') {
      setIsOpen(false)
    }
  }

  const getPopoverClasses = (): string => {
    const baseClasses =
      'absolute z-50 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none'

    const placementClasses = {
      top: 'bottom-full mb-2',
      'top-start': 'bottom-full right-0 mb-2',
      'top-end': 'bottom-full left-0 mb-2',
      bottom: 'top-full mt-2',
      'bottom-start': 'top-full right-0 mt-2',
      'bottom-end': 'top-full left-0 mt-2',
      left: 'right-full mr-2 top-1/2 transform -translate-y-1/2',
      'left-start': 'right-full mr-2 top-0',
      'left-end': 'right-full mr-2 bottom-0',
      right: 'left-full ml-2 top-1/2 transform -translate-y-1/2',
      'right-start': 'left-full ml-2 top-0',
      'right-end': 'left-full ml-2 bottom-0',
    }

    return `${baseClasses} ${placementClasses[placement]} ${isOpen ? 'block' : 'hidden'}`
  }

  return (
    <div className='relative'>
      <button
        ref={triggerRef}
        onClick={handleTriggerClick}
        onMouseEnter={handleTriggerMouseEnter}
        onMouseLeave={handleTriggerMouseLeave}
        type='button'
        className='cursor-pointer'
      >
        {children}
      </button>

      <div ref={popoverRef} className={getPopoverClasses()}>
        {content}
      </div>
    </div>
  )
}
