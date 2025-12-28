// Type declarations for Firebase v10+ with moduleResolution: "node"
// Next.js 12 enforces moduleResolution: "node" which doesn't fully support
// the "exports" field in package.json. These declarations help TypeScript
// find the Firebase module types.

declare module 'firebase/app' {
  export * from 'firebase/app/dist/app/index'
}

declare module 'firebase/auth' {
  export * from 'firebase/auth/dist/auth/index'
}

declare module 'firebase/firestore' {
  export * from 'firebase/firestore/dist/firestore/index'
}
