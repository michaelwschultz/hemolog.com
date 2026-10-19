'use client'

import { IconCopy } from '@tabler/icons-react'
import { type ReactElement, useCallback } from 'react'
import toast from 'react-hot-toast'

interface CodeBlockProps {
  code: string
  label?: string
}

export default function CodeBlock({
  code,
  label,
}: CodeBlockProps): ReactElement {
  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code)
      toast.success('Copied')
    } catch {
      toast.error('Failed to copy')
    }
  }, [code])

  return (
    <div className='relative rounded-lg bg-gray-100 overflow-hidden'>
      <div className='flex items-center justify-between gap-3 px-3 py-1.5 border-b border-gray-200'>
        <span className='text-xs font-medium text-gray-500 uppercase tracking-wide'>
          {label || 'Code'}
        </span>
        <button
          type='button'
          onClick={copyToClipboard}
          className='inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors'
          title='Copy to clipboard'
        >
          <IconCopy className='w-3.5 h-3.5' />
          Copy
        </button>
      </div>
      <pre className='overflow-x-auto p-4 text-sm font-mono text-gray-800 leading-relaxed'>
        <code>{code}</code>
      </pre>
    </div>
  )
}
