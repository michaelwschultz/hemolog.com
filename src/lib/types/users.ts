export interface ApiKeyEntry {
  id: string
  key: string
  description: string
  uid: string
  createdAt: string
  revokedAt?: string | null
}

export interface UserType {
  uid: string
  email: string
  name: string
  alertId?: string
  isAdmin?: boolean
  medication?: string
  monoclonalAntibody?: string
  injectionFrequency?: string
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
