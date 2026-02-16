import { IconCopy } from '@tabler/icons-react'
import type React from 'react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

interface Props {
  alertId: string
  style?: React.CSSProperties
}

export default function EmergencySnippet(props: Props) {
  const { alertId = 'example', style } = props
  const [domain, setDomain] = useState('hemolog.com')

  useEffect(() => {
    // Use actual hostname on client to avoid hydration mismatch
    setDomain(window.location.host)
  }, [])

  const url = `${domain}/emergency/${alertId}`

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      toast.success('Link copied!')
    } catch (err) {
      console.error('Failed to copy: ', err)
      toast.error('Failed to copy link')
    }
  }

  return (
    <div className='flex items-center gap-2'>
      <code
        className='flex-1 bg-gray-100 px-3 py-2 rounded text-sm font-mono text-gray-800 break-all'
        style={style}
      >
        {url}
      </code>
      <button
        type='button'
        onClick={copyToClipboard}
        className='p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors'
        title='Copy to clipboard'
      >
        <IconCopy className='w-4 h-4' />
      </button>
    </div>
  )
}
