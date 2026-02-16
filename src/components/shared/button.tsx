import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
  isLoading?: boolean
}

export default function Button(props: ButtonProps) {
  const {
    variant = 'secondary',
    size = 'md',
    children,
    isLoading,
    className = '',
    disabled,
    ...rest
  } = props

  const baseStyles =
    'inline-flex items-center justify-center font-semibold transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-default whitespace-nowrap w-fit'

  const variantStyles = {
    primary: {
      default:
        'bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-500 shadow-sm hover:shadow',
      disabled: 'bg-gray-500 text-white',
    },
    secondary: {
      default:
        'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 focus:ring-gray-300',
      disabled: 'bg-gray-100 text-gray-500',
    },
    danger: {
      default:
        'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm hover:shadow',
      disabled: 'bg-red-600 text-white',
    },
    ghost: {
      default:
        'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-300',
      disabled: 'bg-transparent text-gray-400',
    },
  }

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm rounded-lg',
    md: 'px-4 py-2.5 text-sm rounded-xl',
    lg: 'px-6 py-3 text-base rounded-xl',
  }

  const styles = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant][disabled ? 'disabled' : 'default']} ${className}`

  return (
    <button className={styles} disabled={disabled || isLoading} {...rest}>
      {isLoading && (
        <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2' />
      )}
      {children}
    </button>
  )
}
