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
    <div className='relative overflow-hidden rounded-2xl bg-ink'>
      <div className='flex items-center justify-between gap-3 border-b border-white/10 px-3 py-1.5'>
        <span className='text-xs font-medium tracking-wide text-white/50 uppercase'>
          {label || 'Code'}
        </span>
        <button
          type='button'
          onClick={copyToClipboard}
          className='inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white'
          title='Copy'
        >
          <IconCopy className='h-3.5 w-3.5' />
          Copy
        </button>
      </div>
      <pre className='overflow-x-auto p-4 font-mono text-[13px] leading-relaxed text-white/90'>
        <code>{code}</code>
      </pre>
    </div>
  )
}
