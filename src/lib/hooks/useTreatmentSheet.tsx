'use client'

import { useCallback, useRef } from 'react'
import TreatmentModalContent from '@/components/home/treatmentModalContent'
import type { TreatmentType } from '@/lib/db/treatments'
import { useSheet } from '@/lib/providers/sheet-provider'

interface TreatmentSheetOptions {
  mode: 'create' | 'edit'
  treatment?: TreatmentType
  previousTreatment?: TreatmentType
}

export function useTreatmentSheet() {
  const { open, close, isOpen } = useSheet()
  const formRef = useRef<{ handleSubmit: () => void }>(null)
  const sheetKeyRef = useRef(0)

  // Store close in ref to avoid recreating openTreatmentSheet when close changes
  const closeRef = useRef(close)
  closeRef.current = close

  // Store open in ref to avoid recreating openTreatmentSheet when open changes
  const openRef = useRef(open)
  openRef.current = open

  // Memoize to prevent recreation on every render
  const openTreatmentSheet = useCallback((options: TreatmentSheetOptions) => {
    const { mode, treatment, previousTreatment } = options
    const title = mode === 'edit' ? 'Edit Treatment' : 'Log Treatment'

    // Increment key to force full remount of component
    sheetKeyRef.current += 1

    openRef.current({
      title,
      content: (
        <TreatmentModalContent
          key={sheetKeyRef.current}
          ref={formRef}
          treatment={treatment}
          previousTreatment={previousTreatment}
          onSuccess={() => {
            closeRef.current()
          }}
        />
      ),
      onSave: () => {
        formRef.current?.handleSubmit()
      },
      saveLabel: mode === 'edit' ? 'Save' : 'Log Treatment',
    })
  }, [])

  return {
    openTreatmentSheet,
    closeTreatmentSheet: close,
    isOpen,
  }
}
