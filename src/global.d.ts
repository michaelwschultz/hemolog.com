declare module '*'

declare global {
  interface Window {
    stonks: {
      event: (
        category: string,
        path: string,
        properties: Record<string, unknown>
      ) => void
    }
  }
}

export {}
