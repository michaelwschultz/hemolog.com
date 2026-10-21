import { IconCopy } from '@tabler/icons-react'
import type React from 'react'
import { type ReactElement, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

interface Props {
  alertId: string
  style?: React.CSSProperties
}

export default function EmergencySnippet(props: Props): ReactElement {
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
      toast.success('Link copied')
    } catch (err) {
      console.error('Failed to copy: ', err)
      toast.error('Failed to copy link')
    }
  }

  return (
    <div className='flex items-center gap-2'>
      <code
        className='flex-1 break-all rounded-xl border border-line bg-surface px-3 py-2 font-mono text-sm text-ink'
        style={style}
      >
        {url}
      </code>
      <button
        type='button'
        onClick={copyToClipboard}
        className='rounded-full p-2 text-slate transition-colors hover:bg-surface hover:text-ink'
        title='Copy link'
      >
        <IconCopy className='h-4 w-4' />
      </button>
    </div>
  )
}
