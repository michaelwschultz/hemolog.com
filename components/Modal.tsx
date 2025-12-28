import type React from 'react'

export interface ModalProps {
  visible: boolean
  onClose?: () => void
  children: React.ReactNode
  title?: string
}

export function Modal({
  visible,
  onClose,
  children,
  title,
}: ModalProps): JSX.Element | null {
  if (!visible) {
    return null
  }

  const handleBackdropClick = (
    event: React.MouseEvent<HTMLDivElement>
  ): void => {
    if (event.target === event.currentTarget && onClose) {
      onClose()
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'Escape' && onClose) {
      onClose()
    }
  }

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      role='dialog'
      aria-modal='true'
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto'>
        {title && (
          <div className='flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700'>
            <h2
              id='modal-title'
              className='text-lg font-semibold text-gray-900 dark:text-white'
            >
              {title}
            </h2>
            {onClose && (
              <button
                onClick={onClose}
                className='text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700'
                aria-label='Close modal'
                type='button'
              >
                <svg
                  className='w-6 h-6'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  aria-hidden='true'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            )}
          </div>
        )}
        <div className='p-6'>{children}</div>
      </div>
    </div>
  )
}
