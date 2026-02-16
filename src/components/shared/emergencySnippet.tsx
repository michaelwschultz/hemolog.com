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
    <div className='relative'>
      <code
        className='block w-full bg-gray-50 px-3 py-2.5 pr-10 rounded-lg text-sm font-mono text-gray-700 break-all border border-gray-100'
        style={style}
      >
        {url}
      </code>
      <button
        type='button'
        onClick={copyToClipboard}
        className='absolute right-1 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors'
        title='Copy to clipboard'
      >
        <IconCopy className='w-4 h-4' />
      </button>
    </div>
  )
}
