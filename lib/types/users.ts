export interface AttachedUserType {
  email: string
  name: string
  photoUrl?: string
  uid: string
}

export interface UserType {
  alertId: string
  displayName?: string
  email: string
  isAdmin?: boolean
  name: string
  photoUrl?: string
  provider: string
  token: string
  uid: string
}
