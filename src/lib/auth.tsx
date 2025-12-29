'use client'

import {
  useState,
  useEffect,
  useContext,
  createContext,
  useCallback,
} from 'react'
import cookie from 'js-cookie'
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onIdTokenChanged,
  GoogleAuthProvider,
  type User,
} from 'firebase/auth'

import { getAuth } from '@/lib/firebase'
import { createUser, fetchUserByUid } from '@/lib/db/users'
import { generateUniqueString } from '@/lib/helpers'
import LoadingScreen from '@/components/shared/loadingScreen'
import type { UserType } from '@/lib/types/users'
import { useRouter, usePathname } from 'next/navigation'

type ContextProps = {
  user: UserType | null
  loading?: boolean
  signout: () => Promise<void>
  signinWithGoogle: (redirect: string) => Promise<void>
  signinWithTestUser: () => Promise<void>
}

const authContext = createContext<Partial<ContextProps>>({
  user: null,
  loading: true, // Start with true to wait for auth state
})

export function AuthProvider({
  children,
}: {
  children: React.ReactNode
}): React.ReactElement {
  const auth = useProvideAuth()
  // Always provide the context with consistent initial values
  // This ensures server and client render the same initial state
  return <authContext.Provider value={auth}>{children}</authContext.Provider>
}

export const useAuth = () => useContext(authContext)

let globalUser: UserType | null = null
let globalLoading = true // Start with true to wait for auth state to be determined
let authListenerInitialized = false

function useProvideAuth() {
  const [user, setUser] = useState<UserType | null>(globalUser)
  const [loading, setLoading] = useState(globalLoading)
  const [pendingRedirect, setPendingRedirect] = useState<string | null>(null)
  const router = useRouter()

  // Handle pending redirects after user state is set
  useEffect(() => {
    if (pendingRedirect && user && !loading) {
      router.push(pendingRedirect)
      setPendingRedirect(null)
    }
  }, [user, loading, pendingRedirect, router])

  const handleUser = useCallback(async (rawUser: User | null) => {
    if (rawUser) {
      let formattedUser: UserType
      try {
        formattedUser = await formatUser(rawUser)
      } catch (error) {
        console.error('Error formatting user:', error)
        // If formatting fails, still set loading to false to unblock UI
        globalLoading = false
        setLoading(false)
        return false
      }

      try {
        // Fetch user data from Firestore using Firestore Lite with timeout
        const dbUser = await withTimeout(fetchUserByUid(formattedUser.uid), 5000)

        const { ...userWithoutToken } = formattedUser

        if (dbUser) {
          formattedUser.alertId = dbUser.alertId
          formattedUser.isAdmin = (dbUser as unknown as UserType).isAdmin
          formattedUser.apiKey = dbUser.apiKey
          formattedUser.medication = dbUser.medication || ''
          formattedUser.monoclonalAntibody = dbUser.monoclonalAntibody || ''
          delete userWithoutToken.alertId
          // Only update if document exists but might be missing fields
          // Don't update on every auth token change to prevent loops
        } else {
          // Only create user document if it doesn't exist
          await createUser(formattedUser.uid, userWithoutToken)
        }
      } catch (error) {
        // Handle offline/connection/timeout errors gracefully
        // These errors are expected when emulator isn't running, connection is temporarily unavailable,
        // or operations take too long on page refresh
        const errorMessage =
          error instanceof Error ? error.message : String(error)
        const isExpectedError =
          errorMessage.includes('offline') ||
          errorMessage.includes('unavailable') ||
          errorMessage.includes('Failed to get document') ||
          errorMessage.includes('Could not reach Cloud Firestore backend') ||
          errorMessage.includes('Firestore not available') ||
          errorMessage.includes('timed out')

        if (isExpectedError) {
          // Don't log these errors - they're expected in development when emulator isn't running
          // or when connection is temporarily unavailable
          console.warn('Firestore operation skipped:', errorMessage)
        } else {
          // Only log unexpected errors
          console.error('Error handling user Firestore operations:', error)
        }
        // Continue even if Firestore operations fail - user can still sign in
        // The user document will be created on next sign-in attempt or when connection is restored
      }

      globalUser = formattedUser
      globalLoading = false
      setUser(formattedUser)
      setLoading(false)

      cookie.set('hemolog-auth', {
        expires: 1,
      })

      return formattedUser
    } else {
      globalUser = null
      globalLoading = false
      setUser(null)
      setLoading(false)

      cookie.remove('hemolog-auth')

      return false
    }
  }, [])

  const signinWithGoogle = async (redirect: string) => {
    if (process.env.NEXT_PUBLIC_USE_EMULATORS) {
      console.warn(
        'Google sign-in is disabled when NEXT_PUBLIC_USE_EMULATORS is enabled. Use the Test User button instead.'
      )
      setLoading(false)
      return
    }

    setLoading(true)
    const auth = getAuth()

    if (!auth) {
      console.error('Firebase auth not available for Google sign-in')
      setLoading(false)
      return
    }

    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      await handleUser(result.user)

      if (redirect) {
        router.push(redirect)
      }
    } catch (error) {
      console.error('Google sign-in error:', error)
      setLoading(false)
    }
  }

  const signinWithTestUser = async () => {
    setLoading(true)

    if (typeof window === 'undefined') {
      console.error('Error: Cannot sign in on server-side')
      setLoading(false)
      return
    }

    const auth = getAuth()

    if (!auth) {
      console.error(
        'Error: Firebase auth not available. Make sure Firebase is initialized and emulator is running.'
      )
      setLoading(false)
      return
    }

    const testEmail = 'michael+test@hemolog.com'
    const testPassword = 'test123'

    try {
      const signInResponse = await signInWithEmailAndPassword(
        auth,
        testEmail,
        testPassword
      )
      if (signInResponse.user) {
        await handleUser(signInResponse.user)
        // Set pending redirect - will navigate after state is updated
        setPendingRedirect('/home')
        return
      }
    } catch (signInError: unknown) {
      const error =
        signInError && typeof signInError === 'object' && 'code' in signInError
          ? (signInError as { code?: string })
          : null

      const isUserNotFound =
        error?.code === 'auth/user-not-found' ||
        error?.code === 'auth/invalid-credential'

      if (!isUserNotFound) {
        console.error('Sign in error:', signInError)
        setLoading(false)
        return
      }

      try {
        const createResponse = await createUserWithEmailAndPassword(
          auth,
          testEmail,
          testPassword
        )
        if (createResponse.user) {
          await handleUser(createResponse.user)
          // Set pending redirect - will navigate after state is updated
          setPendingRedirect('/home')
          return
        }
      } catch (createError: unknown) {
        const createErr =
          createError &&
          typeof createError === 'object' &&
          'code' in createError
            ? (createError as { code?: string })
            : null

        if (createErr?.code === 'auth/email-already-in-use') {
          try {
            const retrySignIn = await signInWithEmailAndPassword(
              auth,
              testEmail,
              testPassword
            )
            if (retrySignIn.user) {
              await handleUser(retrySignIn.user)
              // Set pending redirect - will navigate after state is updated
              setPendingRedirect('/home')
              return
            }
          } catch (retryError) {
            console.error('Retry sign in error:', retryError)
          }
        } else {
          console.error('Create user error:', createError)
        }
        setLoading(false)
      }
    }
  }

  const signout = async () => {
    router.push('/signin')
    const auth = getAuth()
    if (!auth) {
      await handleUser(null)
      return
    }
    await firebaseSignOut(auth)
    await handleUser(null)
  }

  useEffect(() => {
    if (typeof window === 'undefined') {
      // On server, keep loading true (will be set to false on client)
      return
    }

    const auth = getAuth()

    if (!auth) {
      globalLoading = false
      setLoading(false)
      return
    }

    if (globalUser && !user) {
      setUser(globalUser)
      setLoading(false)
      return
    }

    if (authListenerInitialized) {
      // Sync state with global state if it changed
      if (user !== globalUser) {
        setUser(globalUser)
        setLoading(globalLoading)
      }
      return
    }

    // Initialize auth listener - it will call handleUser when auth state is determined
    // This restores the user from Firebase Auth persistence on page refresh
    // The listener fires immediately with the current user (if any) and then on changes
    authListenerInitialized = true
    const unsubscribe = onIdTokenChanged(auth, (firebaseUser) => {
      // This will be called immediately with current user (or null) and then on changes
      // Wrap in async IIFE to properly handle errors and prevent unhandled rejections
      ;(async () => {
        try {
          await handleUser(firebaseUser)
        } catch (error) {
          console.error('Error in auth state handler:', error)
          // Ensure loading state is set to false even if handleUser fails
          globalLoading = false
          setLoading(false)
        }
      })()
    })

    return () => {
      unsubscribe()
      authListenerInitialized = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleUser]) // Only depend on handleUser, not user, to prevent re-initialization

  return {
    user,
    loading,
    signinWithGoogle,
    signinWithTestUser,
    signout,
  }
}

// Helper to add timeout to a promise
function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(
        () => reject(new Error(`Operation timed out after ${timeoutMs}ms`)),
        timeoutMs
      )
    ),
  ])
}

const formatUser = async (rawUser: User): Promise<UserType> => {
  let token = ''
  try {
    // Add 5 second timeout to token retrieval to prevent hanging on page refresh
    const idTokenResult = await withTimeout(rawUser.getIdTokenResult(), 5000)
    token = idTokenResult.token
  } catch (error) {
    // Token retrieval failed or timed out, continue without token
    console.warn('Token retrieval failed:', error instanceof Error ? error.message : 'Unknown error')
  }

  const alertId = await generateUniqueString(6)

  return {
    alertId,
    email: rawUser.email || '',
    name: rawUser.displayName || '',
    photoUrl: rawUser.photoURL || undefined,
    provider: rawUser.providerData?.[0]?.providerId || 'password',
    token: token || '',
    uid: rawUser.uid,
  }
}

export function ProtectRoute({
  children,
}: {
  children: React.ReactNode
}): React.ReactElement | null {
  const { user, loading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(false)

  // Handle redirect in useEffect to avoid updating Router during render
  useEffect(() => {
    // Don't redirect if we're already redirecting or if we're on an allowed page
    if (
      isRedirecting ||
      pathname === '/signin' ||
      pathname.includes('emergency')
    ) {
      return
    }

    if (!loading && !user) {
      setIsRedirecting(true)
      router.replace('/signin')
    }
  }, [loading, user, pathname, router, isRedirecting])

  // Reset redirecting flag when user becomes available
  useEffect(() => {
    if (user) {
      setIsRedirecting(false)
    }
  }, [user])

  if (loading && !user) {
    return <LoadingScreen />
  }

  if (!user) {
    // Allow access to signin and emergency pages
    if (pathname === '/signin' || pathname.includes('emergency')) {
      return <>{children}</>
    }

    // Show loading screen while redirecting
    return <LoadingScreen />
  }

  return <>{children}</>
}
