import { useState } from 'react'

export interface ModalBindings {
  visible: boolean
  setVisible: (visible: boolean) => void
}

export interface UseModalReturn {
  visible: boolean
  setVisible: (visible: boolean) => void
  bindings: ModalBindings
}

export function useModal(initialState = false): UseModalReturn {
  const [visible, setVisible] = useState<boolean>(initialState)

  const bindings: ModalBindings = {
    visible,
    setVisible,
  }

  return {
    visible,
    setVisible,
    bindings,
  }
}
