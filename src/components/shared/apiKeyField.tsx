'use client'

import { IconCopy, IconEye, IconEyeOff } from '@tabler/icons-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

interface ApiKeyFieldProps {
  apiKey: string | undefined
  onReset: () => void
}

export default function ApiKeyField(props: ApiKeyFieldProps) {
  const { apiKey, onReset } = props
  const [showKey, setShowKey] = useState(false)

  const displayKey = apiKey || ''
  const maskedKey = displayKey ? '*'.repeat(displayKey.length) : ''

  const copyToClipboard = async () => {
    if (!apiKey) return
    try {
      await navigator.clipboard.writeText(apiKey)
      toast.success('API key copied!')
    } catch (err) {
      console.error('Failed to copy: ', err)
      toast.error('Failed to copy API key')
    }
  }

  return (
    <div className='flex gap-2 items-center'>
      <div className='flex-1 relative'>
        <code className='block w-full bg-gray-50 px-3 py-2.5 pr-20 rounded-lg text-sm font-mono text-gray-700 break-all border border-gray-100'>
          {showKey ? displayKey : maskedKey}
        </code>
        <div className='absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5'>
          <button
            type='button'
            onClick={() => setShowKey(!showKey)}
            className='p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors'
            title={showKey ? 'Hide API key' : 'Show API key'}
          >
            {showKey ? (
              <IconEyeOff className='w-4 h-4' />
            ) : (
              <IconEye className='w-4 h-4' />
            )}
          </button>
          <button
            type='button'
            onClick={copyToClipboard}
            disabled={!apiKey}
            className='p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
            title='Copy to clipboard'
          >
            <IconCopy className='w-4 h-4' />
          </button>
        </div>
      </div>
      <button
        type='button'
        onClick={onReset}
        className='px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap'
      >
        Reset key
      </button>
    </div>
  )
}
