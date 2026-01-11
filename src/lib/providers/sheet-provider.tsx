'use client'

import { Scroll, useClientMediaQuery } from '@silk-hq/components'
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react'
import { SheetWithKeyboard } from '@/components/home/sheetWithKeyboard/sheetWithKeyboard'
import '@/components/home/sheetWithKeyboard/SheetWithKeyboard.css'
import './sheet-provider.css'

// ================================================================================================
// Types
// ================================================================================================

interface SheetConfig {
  content: ReactNode
  title?: string
  className?: string
  onClose?: () => void
  // Header actions
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

// ================================================================================================
// Context
// ================================================================================================

const SheetContext = createContext<SheetContextValue | null>(null)

// ================================================================================================
// Hook
// ================================================================================================

export function useSheet(): SheetContextValue {
  const context = useContext(SheetContext)
  if (!context) {
    throw new Error('useSheet must be used within a SheetProvider')
  }
  return context
}

// ================================================================================================
// Provider
// ================================================================================================

interface SheetProviderProps {
  children: ReactNode
}

export function SheetProvider({ children }: SheetProviderProps) {
  const largeViewport = useClientMediaQuery('(min-width: 800px)')

  // Sheet state
  const [presented, setPresented] = useState(false)
  const [shouldRenderPortal, setShouldRenderPortal] = useState(false)
  const [config, setConfig] = useState<SheetConfig | null>(null)

  // Refs for cleanup and state tracking
  const onCloseRef = useRef<(() => void) | undefined>(undefined)
  const portalRemovalTimerRef = useRef<NodeJS.Timeout | null>(null)
  const presentedRef = useRef(presented)
  const configRef = useRef<SheetConfig | null>(null)

  // Keep refs in sync
  presentedRef.current = presented
  configRef.current = config

  // Clear any pending portal removal timer
  // React 19 compiler handles memoization automatically
  const clearPortalTimer = () => {
    if (portalRemovalTimerRef.current) {
      clearTimeout(portalRemovalTimerRef.current)
      portalRemovalTimerRef.current = null
    }
  }

  // Open sheet with config - kept as useCallback for context stability
  // biome-ignore lint/correctness/useExhaustiveDependencies: will cause infinite loop
  const open = useCallback((newConfig: SheetConfig) => {
    // If there's still a config (sheet closing), wait for it to clear first
    if (configRef.current) {
      // Clear immediately and wait a frame for state to update
      setConfig(null)
      setShouldRenderPortal(false)
      requestAnimationFrame(() => {
        onCloseRef.current = newConfig.onClose
        setConfig(newConfig)
        setShouldRenderPortal(true)
        requestAnimationFrame(() => {
          setPresented(true)
        })
      })
      return
    }

    clearPortalTimer()
    onCloseRef.current = newConfig.onClose
    setConfig(newConfig)
    setShouldRenderPortal(true)
    // Small delay to ensure portal is mounted before presenting
    requestAnimationFrame(() => {
      setPresented(true)
    })
  }, [])

  // Close sheet - kept as useCallback for context stability
  const close = useCallback(() => {
    setPresented(false)
  }, [])

  // Handle Silk's presented state changes - this is a sync callback
  // Silk calls this to tell us what its internal state is
  // Kept as useCallback since it's passed as a prop callback
  // biome-ignore lint/correctness/useExhaustiveDependencies: will cause infinite loop
  const handlePresentedChange = useCallback((newPresented: boolean) => {
    // Only update if value actually changed to prevent loops
    if (newPresented === presentedRef.current) {
      return
    }

    // Sync our state with Silk's internal state
    setPresented(newPresented)

    // When sheet has fully closed (presented becomes false)
    if (!newPresented) {
      // Schedule portal removal after exit animation completes
      clearPortalTimer()
      portalRemovalTimerRef.current = setTimeout(() => {
        setShouldRenderPortal(false)
        onCloseRef.current?.()
        setConfig(null)
        portalRemovalTimerRef.current = null
      }, 100)
    }
  }, [])

  // Handle backdrop click - React 19 compiler handles memoization automatically
  const handleBackdropClick = () => {
    close()
  }

  // Handle save button click - React 19 compiler handles memoization automatically
  const handleSaveClick = () => {
    config?.onSave?.()
  }

  // Context value - memoized to prevent unnecessary re-renders
  // Note: isOpen uses ref to avoid re-renders when presented changes
  const contextValue = useMemo<SheetContextValue>(
    () => ({
      open,
      close,
      get isOpen() {
        return presentedRef.current
      },
    }),
    [open, close]
  )

  // Default values for header
  const showHeader = config?.showHeader ?? true
  const cancelLabel = config?.cancelLabel ?? 'Cancel'
  const saveLabel = config?.saveLabel ?? 'Save'

  return (
    <SheetContext.Provider value={contextValue}>
      {children}
      <SheetWithKeyboard.Root
        presented={presented}
        onPresentedChange={handlePresentedChange}
      >
        {shouldRenderPortal && config && (
          <SheetWithKeyboard.Portal>
            <SheetWithKeyboard.View>
              <SheetWithKeyboard.Backdrop onPointerDown={handleBackdropClick} />
              <SheetWithKeyboard.Content
                className={`SheetProvider-content ${config.className ?? ''}`.trim()}
              >
                {showHeader && (
                  <div className='SheetProvider-header'>
                    <SheetWithKeyboard.Trigger
                      className='SheetProvider-cancelButton'
                      action='dismiss'
                    >
                      {cancelLabel}
                    </SheetWithKeyboard.Trigger>
                    {config.title && (
                      <SheetWithKeyboard.Title className='SheetProvider-title'>
                        {config.title}
                      </SheetWithKeyboard.Title>
                    )}
                    {config.onSave ? (
                      <button
                        type='button'
                        className='SheetProvider-saveButton'
                        onClick={handleSaveClick}
                      >
                        {saveLabel}
                      </button>
                    ) : (
                      <div /> // Placeholder for grid alignment
                    )}
                  </div>
                )}
                <Scroll.Root asChild>
                  <Scroll.View
                    className='SheetProvider-scrollView'
                    scrollGestureTrap={{ yEnd: !largeViewport }}
                  >
                    <Scroll.Content className='SheetProvider-scrollContent'>
                      {config.content}
                    </Scroll.Content>
                  </Scroll.View>
                </Scroll.Root>
              </SheetWithKeyboard.Content>
            </SheetWithKeyboard.View>
          </SheetWithKeyboard.Portal>
        )}
      </SheetWithKeyboard.Root>
    </SheetContext.Provider>
  )
}
