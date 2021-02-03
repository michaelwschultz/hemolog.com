import React, { useState, useEffect, useContext, createContext } from 'react'
import Router from 'next/router'
import cookie from 'js-cookie'

import firebase from 'lib/firebase'
import { createUser } from 'lib/db/users'
import { generateUniqueString } from 'lib/helpers'
import LoadingScreen from 'components/loadingScreen'
import { UserType } from 'lib/types/users'

const authContext = createContext(undefined)

export function AuthProvider({ children }) {
  const auth = useProvideAuth()
  return <authContext.Provider value={auth}>{children}</authContext.Provider>
}

export const useAuth = () => {
  return useContext(authContext)
}

const firestore = firebase.firestore()

function useProvideAuth() {
  const [user, setUser] = useState<UserType>(null)
  const [loading, setLoading] = useState(true)

  const handleUser = async (rawUser) => {
    if (rawUser) {
      const user = await formatUser(rawUser)
      const dbUser = await firestore.collection('users').doc(user.uid).get()

      const { token, ...userWithoutToken } = user

      // TODO(michael) If user already exist then remove alertId
      // so it isn't overwritten when the user is updated on `createUser`
      // and overwrite the alertId created in the formatter.
      // This needs to be cleaned up. isAdmin is also appended to
      // the user here.
      if (dbUser.exists) {
        user.alertId = dbUser.data().alertId
        user.isAdmin = dbUser.data().isAdmin
        delete userWithoutToken.alertId
      }

      createUser(user.uid, userWithoutToken)
      setUser(user)

      cookie.set('hemolog-auth', true, {
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

  const signinWithGoogle = (redirect) => {
    setLoading(true)
    return firebase
      .auth()
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then((response) => {
        handleUser(response.user)

        if (redirect) {
          Router.push(redirect)
        }
      })
  }

  const signout = () => {
    Router.push('/signin')
    return firebase
      .auth()
      .signOut()
      .then(() => handleUser(false))
  }

  useEffect(() => {
    const unsubscribe = firebase.auth().onIdTokenChanged(handleUser)

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

const formatUser = async (user): Promise<UserType> => {
  const idTokenResult = await user.getIdTokenResult()
  const token = idTokenResult.token
  const alertId = await generateUniqueString(6)

  return {
    alertId,
    email: user.email,
    name: user.displayName,
    photoUrl: user.photoURL,
    provider: user.providerData[0].providerId,
    token,
    uid: user.uid,
  }
}

// NOTE(michael) This takes care of protecting unauthed users
// from seeing any protected pages. This could be handled better,
// but this works for now
export const ProtectRoute = ({ children }) => {
  const { user, loading }: { user: UserType; loading: boolean } = useAuth()

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
