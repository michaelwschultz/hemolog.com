export interface User {
  uid: string
  email: string
  token: string
  displayName: string
  photoUrl: string
}

export const mapUserData = async (user): Promise<User> => {
  const { uid, email, displayName, photoURL } = user
  const token = await user.getIdToken(true)

  return {
    uid,
    email,
    token,
    displayName,
    photoUrl: photoURL,
  }
}
