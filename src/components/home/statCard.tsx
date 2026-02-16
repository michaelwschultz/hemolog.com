import type { ReactNode } from 'react'

interface Props {
  value: string | number
  label: ReactNode
  loading?: boolean
  type?: 'default' | 'success' | 'warning' | 'error'
  shadow?: boolean
  style?: React.CSSProperties
  icon?: ReactNode
  description?: string
  children?: ReactNode
}

export default function StatCard(props: Props) {
  const {
    value,
    label,
    loading = false,
    type = 'default',
    shadow = true,
    style,
    icon,
    description,
  } = props

  const typeStyles = {
    default: {
      bg: 'bg-white',
      border: 'border-gray-100',
      accent: 'text-gray-900',
      label: 'text-gray-500',
      iconBg: 'bg-gray-50',
    },
    success: {
      bg: 'bg-white',
      border: 'border-emerald-100',
      accent: 'text-emerald-700',
      label: 'text-emerald-600',
      iconBg: 'bg-emerald-50',
    },
    warning: {
      bg: 'bg-white',
      border: 'border-amber-100',
      accent: 'text-amber-700',
      label: 'text-amber-600',
      iconBg: 'bg-amber-50',
    },
    error: {
      bg: 'bg-white',
      border: 'border-rose-100',
      accent: 'text-rose-700',
      label: 'text-rose-600',
      iconBg: 'bg-rose-50',
    },
  }

  const styles = typeStyles[type]

  if (loading) {
    return (
      <div
        className={`relative overflow-hidden rounded-2xl border ${styles.border} ${styles.bg} ${
          shadow ? 'shadow-sm' : ''
        } min-h-[140px] flex flex-col`}
        style={style}
      >
        <div className='absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-100/50 to-transparent' />
        <div className='p-5 flex flex-col h-full justify-between relative z-10'>
          <div className='flex items-start justify-between'>
            <div className='h-8 w-20 bg-gray-200 rounded-lg animate-pulse' />
            <div className='h-8 w-8 bg-gray-200 rounded-lg animate-pulse' />
          </div>
          <div>
            <div className='h-4 w-32 bg-gray-200 rounded animate-pulse mb-2' />
            {description && (
              <div className='h-3 w-24 bg-gray-100 rounded animate-pulse' />
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border ${styles.border} ${styles.bg} ${
        shadow ? 'shadow-sm hover:shadow-md' : ''
      } transition-all duration-300 min-h-[140px] flex flex-col`}
      style={style}
    >
      {/* Subtle gradient overlay */}
      <div className='absolute inset-0 bg-gradient-to-br from-transparent to-gray-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />

      <div className='p-5 flex flex-col h-full justify-between relative z-10'>
        <div className='flex items-start justify-between'>
          <div className='flex-1'>
            <div
              className={`text-3xl font-bold tracking-tight ${styles.accent} mb-1`}
            >
              {value}
            </div>
            <div className={`text-sm font-medium ${styles.label}`}>{label}</div>
          </div>

          {icon && (
            <div
              className={`p-2.5 rounded-xl ${styles.iconBg} transition-transform duration-300 group-hover:scale-110`}
            >
              {icon}
            </div>
          )}
        </div>

        {description && (
          <div className={`text-xs mt-3 ${styles.label} opacity-75`}>
            {description}
          </div>
        )}
      </div>

      {/* Bottom accent line */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
      />
    </div>
  )
}
