interface Props {
  value: string | number
  label: string | React.Component
  loading?: boolean
  type?: 'default' | 'success' | 'warning' | 'error'
  shadow?: boolean
  style?: React.CSSProperties
}

export default function StatCard(props: Props): JSX.Element {
  const {
    value,
    label,
    loading = false,
    type = 'default',
    shadow = true,
    style,
  } = props

  const typeClasses = {
    default: 'bg-white',
    success: 'bg-success-50 border-success-200',
    warning: 'bg-warning-50 border-warning-200',
    error: 'bg-error-50 border-error-200',
  }

  return (
    <div
      className={`w-full min-h-[116px] h-full rounded-lg border p-4 ${
        shadow && !loading ? 'shadow-md' : ''
      } ${typeClasses[type]}`}
      style={style}
    >
      <div className='text-2xl font-semibold mb-2'>{value}</div>
      <div className='text-sm text-gray-600'>{label}</div>
      {loading && (
        <div className='flex justify-center mt-4'>
          <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500'></div>
        </div>
      )}
    </div>
  )
}
