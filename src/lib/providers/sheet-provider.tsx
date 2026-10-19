'use client'

import { Sheet } from '@silk-hq/components'
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react'
import '@/components/home/sheetWithKeyboard/SheetWithKeyboard.css'
import './sheet-provider.css'

interface SheetConfig {
  content: ReactNode
  title?: string
  className?: string
  onClose?: () => void
  showHeader?: boolean
  cancelLabel?: string
  saveLabel?: string
  onSave?: () => void
}

interface SheetContextValue {
  open: (config: SheetConfig) => void
  close: () => void
  isOpen: boolean
}

const SheetContext = createContext<SheetContextValue | null>(null)

export function useSheet(): SheetContextValue {
  const context = useContext(SheetContext)
  if (!context) {
    throw new Error('useSheet must be used within a SheetProvider')
  }
  return context
}

interface SheetProviderProps {
  children: ReactNode
}

export function SheetProvider({ children }: SheetProviderProps) {
  const [presented, setPresented] = useState(false)
  const [config, setConfig] = useState<SheetConfig | null>(null)
  const onCloseRef = useRef<(() => void) | undefined>(undefined)
  const portalRemovalTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  )

  const clearPortalTimer = useCallback(() => {
    if (portalRemovalTimerRef.current) {
      clearTimeout(portalRemovalTimerRef.current)
      portalRemovalTimerRef.current = null
    }
  }, [])

  const open = useCallback(
    (newConfig: SheetConfig) => {
      clearPortalTimer()
      onCloseRef.current = newConfig.onClose
      setPresented(false)
      setConfig(newConfig)
      requestAnimationFrame(() => {
        setPresented(true)
      })
    },
    [clearPortalTimer]
  )

  const close = useCallback(() => {
    setPresented(false)
  }, [])

  const handlePresentedChange = useCallback(
    (newPresented: boolean) => {
      setPresented(newPresented)

      if (!newPresented) {
        clearPortalTimer()
        portalRemovalTimerRef.current = setTimeout(() => {
          onCloseRef.current?.()
          setConfig(null)
          portalRemovalTimerRef.current = null
        }, 300)
      }
    },
    [clearPortalTimer]
  )

  const contextValue = useMemo<SheetContextValue>(
    () => ({
      open,
      close,
      isOpen: presented,
    }),
    [open, close, presented]
  )

  const showHeader = config?.showHeader ?? true
  const cancelLabel = config?.cancelLabel ?? 'Cancel'
  const saveLabel = config?.saveLabel ?? 'Save'

  return (
    <SheetContext.Provider value={contextValue}>
      {children}
      <Sheet.Root
        license='non-commercial'
        presented={presented}
        onPresentedChange={handlePresentedChange}
      >
        {config && (
          <Sheet.Portal>
            <Sheet.View>
              <Sheet.Content className='SheetProvider-content'>
                {showHeader && (
                  <div className='SheetProvider-header'>
                    <button
                      type='button'
                      className='SheetProvider-cancelButton'
                      onClick={close}
                    >
                      {cancelLabel}
                    </button>
                    {config.title && (
                      <Sheet.Title className='SheetProvider-title'>
                        {config.title}
                      </Sheet.Title>
                    )}
                    {config.onSave ? (
                      <button
                        type='button'
                        className='SheetProvider-saveButton'
                        onClick={() => config.onSave?.()}
                      >
                        {saveLabel}
                      </button>
                    ) : (
                      <div />
                    )}
                  </div>
                )}
                {config.content}
              </Sheet.Content>
            </Sheet.View>
          </Sheet.Portal>
        )}
      </Sheet.Root>
    </SheetContext.Provider>
  )
}
