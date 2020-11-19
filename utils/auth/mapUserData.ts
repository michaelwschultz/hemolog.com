import { profile } from "console"

export const mapUserData = async (user) => {
  const { uid, email, displayName, photoURL } = user
  const token = await user.getIdToken(true)
  return {
    id: uid,
    email,
    token,
    displayName,
    photoUrl: photoURL,
  }
}