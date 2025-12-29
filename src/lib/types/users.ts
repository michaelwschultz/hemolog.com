// Placeholder - need to restore from git
export interface UserType {
  uid: string
  email: string
  name: string
  alertId?: string
  isAdmin?: boolean
  apiKey?: string
  medication?: string
  monoclonalAntibody?: string
  photoUrl?: string
  provider?: string
  token?: string
}

export interface AttachedUserType {
  email: string
  name: string
  photoUrl: string
  uid: string
}
