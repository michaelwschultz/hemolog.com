'use client'

import { useRef } from 'react'
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

  // React 19 compiler handles memoization automatically
  const openTreatmentSheet = (options: TreatmentSheetOptions) => {
    const { mode, treatment, previousTreatment } = options
    const title = mode === 'edit' ? 'Edit Treatment' : 'Log Treatment'

    // Increment key to force full remount of component
    sheetKeyRef.current += 1

    open({
      title,
      content: (
        <TreatmentModalContent
          key={sheetKeyRef.current}
          ref={formRef}
          treatment={treatment}
          previousTreatment={previousTreatment}
          onSuccess={() => {
            close()
          }}
        />
      ),
      onSave: () => {
        formRef.current?.handleSubmit()
      },
      saveLabel: mode === 'edit' ? 'Save' : 'Log Treatment',
    })
  }

  return {
    openTreatmentSheet,
    closeTreatmentSheet: close,
    isOpen,
  }
}
