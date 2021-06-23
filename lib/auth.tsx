import React, { useState, useEffect, useContext, createContext } from 'react'
import Router from 'next/router'
import cookie from 'js-cookie'

import { firestore, firebaseAuth } from 'lib/firebase'
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { createUser } from 'lib/db/users'
import { generateUniqueString } from 'lib/helpers'
import LoadingScreen from 'components/loadingScreen'
import { UserType } from 'lib/types/users'
import { Person } from './types/person'

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

  // TODO: add typing
  const handleUser = async (rawUser: any) => {
    if (rawUser) {
      const user = await formatUser(rawUser)
      const userRef = doc(firestore, 'users', rawUser.id)
      const userSnapshot = await getDoc(userRef)

      const { token, ...userWithoutToken } = user

      // TODO(michael) If user already exist then remove alertId
      // so it isn't overwritten when the user is updated on `createUser`
      // and overwrite the alertId created in the formatter.
      // This needs to be cleaned up. isAdmin is also appended to
      // the user here.
      if (userSnapshot.exists()) {
        const dbUser = userSnapshot.data() as Person
        user.alertId = dbUser.alertId
        user.isAdmin = dbUser.isAdmin
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

  // TODO: add ability to use email
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

  const signinWithGoogle = (redirect: string) => {
    const provider = new GoogleAuthProvider()
    setLoading(true)
    signInWithPopup(firebaseAuth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result)

        if (credential) {
          // const token = credential.accessToken
          const user = result.user
          handleUser(user)

          if (redirect) {
            Router.push(redirect)
          }
        }
      })
      .catch((error) => {
        console.log(
          error.message,
          error.code,
          error.email,
          GoogleAuthProvider.credentialFromError(error)
        )
      })
  }

  const signout = () => {
    Router.push('/signin')
    firebaseAuth.signOut().then(() => handleUser(false))
  }

  useEffect(() => {
    const unsubscribe = firebaseAuth.onIdTokenChanged(handleUser)

    return () => unsubscribe()
  }, [])

  return {
    user,
    loading,
    // signinWithEmail,
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
