import { useState, useEffect, useContext, createContext } from 'react'
import Router from 'next/router'
import cookie from 'js-cookie'

import firebase, { firestore } from 'lib/firebase'
import { createUser } from 'lib/db/users'
import { generateUniqueString } from 'lib/helpers'
import LoadingScreen from 'components/loadingScreen'
import { UserType } from 'lib/types/users'

type ContextProps = {
  user: UserType | null
  loading?: boolean
  signout: any
  signinWithGoogle: any
}

const authContext = createContext<Partial<ContextProps>>({})

export function AuthProvider({ children }: { children: any }) {
  const auth = useProvideAuth()
  return <authContext.Provider value={auth}>{children}</authContext.Provider>
}

export const useAuth = () => useContext(authContext)

function useProvideAuth() {
  const [user, setUser] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)

  const handleUser = async (rawUser: any) => {
    if (rawUser) {
      const user = await formatUser(rawUser)
      const dbUser = await firestore.collection('users').doc(user.uid).get()

      const { token, ...userWithoutToken } = user

      // TODO(michael) If user already exist then remove alertId
      // so it isn't overwritten when the user is updated on `createUser`
      // and overwrite the alertId created in the formatter.
      // This needs to be cleaned up. isAdmin, an dapiKey is also appended to
      // the user here.
      if (dbUser.exists) {
        user.alertId = dbUser.data()!.alertId
        user.isAdmin = dbUser.data()!.isAdmin
        user.apiKey = dbUser.data()!.apiKey
        delete userWithoutToken.alertId
      }

      createUser(user.uid, userWithoutToken)
      setUser(user)

      cookie.set('hemolog-auth', {
        expires: 1,
      })

      setLoading(false)
      return user
    } else {
      setUser(null)
      cookie.remove('hemolog-auth')

      setLoading(false)
      return false
    }
  }

  //   const signinWithEmail = (email, password) => {
  //     setLoading(true)
  //     return firebase
  //       .auth()
  //       .signInWithEmailAndPassword(email, password)
  //       .then((response) => {
  //         handleUser(response.user)
  //         Router.push('/sites')
  //       })
  //   }

  //   const signinWithGitHub = (redirect) => {
  //     setLoading(true)
  //     return firebase
  //       .auth()
  //       .signInWithPopup(new firebase.auth.GithubAuthProvider())
  //       .then((response) => {
  //         handleUser(response.user)

  //         if (redirect) {
  //           Router.push(redirect)
  //         }
  //       })
  //   }

  const auth = firebase.auth()
  // use emulator if developing locally
  if (
    process.env.NODE_ENV === 'development' &&
    process.env.NEXT_PUBLIC_TEST_AGAINST_PROD !== 'true'
  ) {
    auth.useEmulator('http://localhost:9099')
  }

  const signinWithGoogle = (redirect: string) => {
    setLoading(true)
    return auth
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then((response) => {
        handleUser(response.user)

        if (redirect) {
          Router.push(redirect)
        }
      })
      .catch(() => {
        setLoading(false)
      })
  }

  const signout = () => {
    Router.push('/signin')
    return auth.signOut().then(() => handleUser(false))
  }

  useEffect(() => {
    const unsubscribe = auth.onIdTokenChanged(handleUser)

    return () => unsubscribe()
  }, [])

  return {
    user,
    loading,
    // signinWithEmail,
    // signinWithGitHub,
    signinWithGoogle,
    signout,
  }
}

const formatUser = async (rawUser: any): Promise<UserType> => {
  const idTokenResult = await rawUser.getIdTokenResult()
  const token = idTokenResult.token
  const alertId = await generateUniqueString(6)

  return {
    alertId,
    email: rawUser.email,
    name: rawUser.displayName,
    photoUrl: rawUser.photoURL,
    provider: rawUser.providerData[0].providerId,
    token,
    uid: rawUser.uid,
  }
}

// NOTE(michael) This takes care of protecting unauthed users
// from seeing any protected pages. This could be handled better,
// but this works for now
export const ProtectRoute = ({ children }: { children: any }) => {
  const { user, loading } = useAuth()

  if (loading && !user) {
    return <LoadingScreen />
  }

  const { pathname } = window.location

  if (!user && pathname !== '/signin' && !pathname.includes('emergency')) {
    Router.push('/signin')
    return null
  }

  return children
}
