import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import firebase from 'firebase/app'
import 'firebase/auth'
import initFirebase from 'utils/auth/initFirebase'
import { setUserCookie } from 'utils/auth/userCookies'
import { mapUserData } from 'utils/auth/mapUserData'

// TODO: would be nice to move this to a Provider https://www.youtube.com/watch?v=1BUT7T9ThlU

// Init the Firebase app.
initFirebase()

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
    signInSuccessWithAuthResult: async ({ user }, _redirectUrl) => {
      const userData = await mapUserData(user)
      setUserCookie(userData)
    },
  },
}

const FirebaseAuth = (): JSX.Element => {
  return (
    <div>
      <StyledFirebaseAuth
        // @ts-ignore
        uiConfig={firebaseAuthConfig}
        firebaseAuth={firebase.auth()}
      />
    </div>
  )
}

export default FirebaseAuth
