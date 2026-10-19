import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'API — Hemolog',
  description:
    'Use your Hemolog API key to read treatment history and log treatments from Shortcuts, scripts, and other apps.',
}

export default function DocsLayout({ children }: { children: ReactNode }) {
  return children
}
