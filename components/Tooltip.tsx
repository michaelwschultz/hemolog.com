import React, { useState, useRef } from 'react'

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right'

export interface TooltipProps {
  content: string
  children: React.ReactElement
  placement?: TooltipPlacement
  delay?: number
}

export function Tooltip({
  content,
  children,
  placement = 'top',
  delay = 200,
}: TooltipProps): JSX.Element {
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const showTooltip = (): void => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => setIsVisible(true), delay)
  }

  const hideTooltip = (): void => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsVisible(false)
  }

  const getTooltipClasses = (): string => {
    const baseClasses =
      'absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 dark:bg-gray-700 rounded-md shadow-md whitespace-nowrap pointer-events-none transition-opacity duration-200'

    const placementClasses = {
      top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
      bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
      left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
      right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
    }

    return `${baseClasses} ${placementClasses[placement]} ${isVisible ? 'opacity-100' : 'opacity-0'}`
  }

  const getArrowClasses = (): string => {
    const baseClasses =
      'absolute w-2 h-2 bg-gray-900 dark:bg-gray-700 transform rotate-45'

    const arrowClasses = {
      top: 'top-full left-1/2 transform -translate-x-1/2 -mt-1',
      bottom: 'bottom-full left-1/2 transform -translate-x-1/2 -mb-1',
      left: 'left-full top-1/2 transform -translate-y-1/2 -ml-1',
      right: 'right-full top-1/2 transform -translate-y-1/2 -mr-1',
    }

    return `${baseClasses} ${arrowClasses[placement]}`
  }

  return (
    <div className='relative inline-block'>
      {React.cloneElement(children, {
        onMouseEnter: showTooltip,
        onMouseLeave: hideTooltip,
        onFocus: showTooltip,
        onBlur: hideTooltip,
      })}

      {isVisible && (
        <div className={getTooltipClasses()} role='tooltip'>
          {content}
          <div className={getArrowClasses()} />
        </div>
      )}
    </div>
  )
}
