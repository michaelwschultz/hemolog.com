import React, { useState, useEffect, useContext, createContext } from 'react'
import Router from 'next/router'
import cookie from 'js-cookie'

import firebase from 'lib/firebase'
import { createUser } from 'lib/db/users'
import { generateUniqueString } from 'lib/helpers'

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
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const handleUser = async (rawUser) => {
    if (rawUser) {
      const user = await formatUser(rawUser)
      const dbUser = await firestore.collection('users').doc(user.uid).get()

      const { token, ...userWithoutToken } = user

      // If user already exist then remove alertId
      // so it isn't overwritten when the user is updated on `createUser`
      if (dbUser.exists) {
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
      setUser(false)
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
    Router.push('/v2/login')

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

const formatUser = async (user) => {
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
