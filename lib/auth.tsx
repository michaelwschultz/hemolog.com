import { useState, useEffect, useContext, createContext } from 'react'
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

import { getAuth, firestore, collection, doc, getDoc } from 'lib/firebase'
import { createUser } from 'lib/db/users'
import { generateUniqueString } from 'lib/helpers'
import LoadingScreen from 'components/loadingScreen'
import type { UserType } from 'lib/types/users'
import Router from 'next/router'

type ContextProps = {
  user: UserType | null
  loading?: boolean
  signout: () => Promise<void>
  signinWithGoogle: (redirect: string) => Promise<void>
  signinWithTestUser: () => Promise<void>
}

const authContext = createContext<Partial<ContextProps>>({
  user: null,
  loading: true,
})

export function AuthProvider({
  children,
}: {
  children: React.ReactNode
}): React.ReactElement {
  const auth = useProvideAuth()
  if (typeof window === 'undefined') {
    return <>{children}</>
  }
  return <authContext.Provider value={auth}>{children}</authContext.Provider>
}

export const useAuth = () => useContext(authContext)

function useProvideAuth() {
  const [user, setUser] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)

  const handleUser = async (rawUser: User | null) => {
    if (rawUser) {
      const formattedUser = await formatUser(rawUser)
      const db = firestore.instance

      if (db) {
        const userDocRef = doc(collection(db, 'users'), formattedUser.uid)
        const dbUserSnap = await getDoc(userDocRef)

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { ...userWithoutToken } = formattedUser

        // TODO(michael) If user already exist then remove alertId
        // so it isn't overwritten when the user is updated on `createUser`
        // and overwrite the alertId created in the formatter.
        // This needs to be cleaned up.
        if (dbUserSnap.exists()) {
          const dbData = dbUserSnap.data()
          formattedUser.alertId = dbData?.alertId
          formattedUser.isAdmin = dbData?.isAdmin
          formattedUser.apiKey = dbData?.apiKey
          formattedUser.medication = dbData?.medication || ''
          formattedUser.monoclonalAntibody = dbData?.monoclonalAntibody || ''
          delete userWithoutToken.alertId
        }

        await createUser(formattedUser.uid, userWithoutToken)
      }

      setUser(formattedUser)

      cookie.set('hemolog-auth', {
        expires: 1,
      })

      setLoading(false)
      return formattedUser
    } else {
      setUser(null)
      cookie.remove('hemolog-auth')

      setLoading(false)
      return false
    }
  }

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
        Router.push(redirect)
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
      // Try to sign in directly first (user might already exist)
      const signInResponse = await signInWithEmailAndPassword(
        auth,
        testEmail,
        testPassword
      )
      if (signInResponse.user) {
        await handleUser(signInResponse.user)
        Router.push('/home')
        return
      }
    } catch (signInError: unknown) {
      // If user doesn't exist, create them
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

      // User doesn't exist, create them using Firebase SDK
      try {
        const createResponse = await createUserWithEmailAndPassword(
          auth,
          testEmail,
          testPassword
        )
        if (createResponse.user) {
          await handleUser(createResponse.user)
          Router.push('/home')
          return
        }
      } catch (createError: unknown) {
        // If email already exists (race condition), try signing in again
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
              Router.push('/home')
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
    Router.push('/signin')
    const auth = getAuth()
    if (!auth) {
      await handleUser(null)
      return
    }
    await firebaseSignOut(auth)
    await handleUser(null)
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: handleUser is stable and would cause infinite re-renders
  useEffect(() => {
    // Only initialize auth listener on client-side when Firebase is available
    if (typeof window === 'undefined') {
      setLoading(false)
      return
    }

    const auth = getAuth()

    if (!auth) {
      setLoading(false)
      return
    }

    const unsubscribe = onIdTokenChanged(auth, handleUser)
    return () => unsubscribe()
  }, [])

  return {
    user,
    loading,
    signinWithGoogle,
    signinWithTestUser,
    signout,
  }
}

const formatUser = async (rawUser: User): Promise<UserType> => {
  let token = ''
  try {
    const idTokenResult = await rawUser.getIdTokenResult()
    token = idTokenResult.token
  } catch {
    // Token retrieval failed, continue without token
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

// NOTE(michael) This takes care of protecting unauthed users
// from seeing any protected pages. This could be handled better,
// but this works for now
export function ProtectRoute({
  children,
}: {
  children: React.ReactNode
}): React.ReactElement | null {
  const { user, loading } = useAuth()
  if (typeof window === 'undefined') return null

  if (loading && !user) {
    return <LoadingScreen />
  }

  const { pathname } = window.location

  if (!user) {
    // allow access to signin and emergency pages
    if (pathname === '/signin' || pathname.includes('emergency')) {
      return <>{children}</>
    }

    // Redirect to signin for all other routes when not authenticated
    if (typeof window !== 'undefined') {
      Router.replace('/signin')
      return <LoadingScreen />
    }
    return null
  }

  return <>{children}</>
}
