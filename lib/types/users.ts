export interface AttachedUserType {
  email: string
  name: string
  photoUrl?: string
  uid: string
}

export interface UserType {
  alertId?: string
  displayName?: string
  email: string
  isAdmin?: boolean
  name: string
  photoUrl?: string
  medication?: string
  monoclonalAntibody?: string
  injectionFrequency?: string
  provider: string
  /**
   * SECURITY: This is the client-side Firebase ID Token.
   * It MUST NEVER be persisted to Firestore. It is an ephemeral
   * credential and will expire in ~1 hour.
   */
  token: string
  uid: string
  /**
   * SECURITY: The raw API Key should not be stored in Firestore.
   * It is generated client-side and transmitted once via the
   * Authorization header, never written to the database.
   */
  apiKey?: string
}
