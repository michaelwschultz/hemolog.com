import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import initFirebase from 'utils/auth/initFirebase'
import { setUserCookie } from 'utils/auth/userCookies'
import { mapUserData } from 'utils/auth/mapUserData'
import { customAlphabet } from 'nanoid/async'

// TODO: would be nice to move this to a Provider https://www.youtube.com/watch?v=1BUT7T9ThlU

// Init the Firebase app.
initFirebase()
const db = firebase.firestore()

async function generateUniqueAlertId() {
  // removed 'i' and 'l' for clarity when reading the id on different mediums i.e. (paper, url)
  const alphabet = '0123456789ABCDEFGHJKMNOPQRSTUVWXYZabcdefghjkmnopqrstuvwxyz'
  const nanoid = customAlphabet(alphabet, 6)
  const alertId = await nanoid()

  return alertId
}

const firebaseAuthConfig = {
  signInFlow: 'popup',
  immediateFederatedRedirect: false,
  // Auth providers
  // https://github.com/firebase/firebaseui-web#configure-oauth-providers
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    // TODO: Add email/password option
    // {
    //   provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
    //   requireDisplayName: false,
    // },
  ],

  signInSuccessUrl: '/v2',
  credentialHelper: 'none',
  callbacks: {
    signInSuccessWithAuthResult: async (
      { user }: { user: firebase.User },
      _redirectUrl
    ) => {
      const userData = await mapUserData(user)
      setUserCookie(userData)

      const dbDoc = db.collection('users').doc(user.uid)
      const dbUser = await dbDoc.get()

      // if no user exist in Firestore, create them!
      if (!dbUser.exists) {
        const alertId = await generateUniqueAlertId()
        return await db.collection('users').doc(user.uid).set({
          uid: user.uid,
          alertId,
          name: user.displayName,
          photoUrl: user.photoURL,
          createdAt: new Date().toISOString(),
        })
      }
    },
  },
}

const FirebaseAuth = (): JSX.Element => {
  return (
    <StyledFirebaseAuth
      // @ts-ignore
      uiConfig={firebaseAuthConfig}
      firebaseAuth={firebase.auth()}
    />
  )
}

export default FirebaseAuth
