interface Props {
  value: string | number
  label: React.ReactNode
  loading?: boolean
  type?: 'default' | 'success' | 'warning' | 'error'
  shadow?: boolean
  style?: React.CSSProperties
}

import type { ReactElement } from 'react'

export default function StatCard(props: Props): ReactElement {
  const { value, label, loading = false, type = 'default', style } = props

  const typeClasses = {
    default: '',
    success: 'bg-success-50',
    warning: 'bg-warning-50',
    error: 'bg-error-50',
  }

  return (
    <div
      className={`assay min-h-[116px] p-5 ${typeClasses[type]}`}
      style={style}
    >
      {loading ? (
        <div className='flex h-full min-h-[76px] items-center'>
          <div className='h-5 w-5 animate-spin rounded-full border-2 border-line border-t-primary-500' />
        </div>
      ) : (
        <>
          <div className='font-mono text-2xl font-medium tracking-tight text-ink'>
            {value}
          </div>
          <div className='mt-2 text-sm leading-snug text-slate'>{label}</div>
        </>
      )}
    </div>
  )
}
