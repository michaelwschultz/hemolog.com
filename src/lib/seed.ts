// seed.ts
// Script to populate Firebase DB with test user data for alertId 'mike29'
// Run with: NEXT_PUBLIC_USE_EMULATORS=true npx tsx src/lib/seed.ts
//
// IMPORTANT: This script only works with Firebase emulators for safety.
// It will refuse to run if emulators are not enabled.

import { adminFirestore } from './firebase-admin'
import type { Person } from './types/person'
import {
  TreatmentTypeEnum,
  type TreatmentType,
  type TreatmentTypeOptions,
} from './db/infusions'
import type { AttachedUserType } from './types/users'

// Safety check: Only allow running with emulators
function checkEmulatorMode() {
  const useEmulators = process.env.NEXT_PUBLIC_USE_EMULATORS === 'true'
  const firestoreEmulatorHost = process.env.FIRESTORE_EMULATOR_HOST

  if (!useEmulators) {
    console.error(
      '❌ ERROR: This seed script can only run with Firebase emulators enabled.'
    )
    console.error('')
    console.error('To run this script, set NEXT_PUBLIC_USE_EMULATORS=true:')
    console.error('  NEXT_PUBLIC_USE_EMULATORS=true npx tsx src/lib/seed.ts')
    console.error('')
    console.error('Make sure Firebase emulators are running:')
    console.error('  pnpm firebase:dev')
    process.exit(1)
  }

  if (!firestoreEmulatorHost && !process.env.FIREBASE_AUTH_EMULATOR_HOST) {
    // Set emulator hosts if not already set (for safety)
    process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8082'
    process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099'
    console.log('✓ Emulator hosts configured')
  }

  console.log('✓ Running in emulator mode (safe for local development)')
  console.log('')
}

// Helper to filter undefined values from objects (Firestore doesn't accept undefined)
function cleanUndefined<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined)
  ) as Partial<T>
}

async function seedInfusions(
  user: AttachedUserType,
  medicationBrand: string,
  count: number = 10
): Promise<void> {
  const infusionTypes: TreatmentTypeOptions[] = [
    TreatmentTypeEnum.ANTIBODY,
    TreatmentTypeEnum.PROPHY,
    TreatmentTypeEnum.BLEED,
    TreatmentTypeEnum.PREVENTATIVE,
  ]

  const sites = ['Left arm', 'Right arm', 'Left leg', 'Right leg', 'Stomach']
  const causes = ['', 'Minor cut', 'Bruise', 'Joint pain', 'Preventive']

  const now = new Date()
  const infusions: TreatmentType[] = []

  for (let i = 0; i < count; i++) {
    // Spread infusions over the last 30 days
    const daysAgo = Math.floor((i / count) * 30)
    const infusionDate = new Date(now)
    infusionDate.setDate(infusionDate.getDate() - daysAgo)

    const dateStr = infusionDate.toISOString().slice(0, 10)
    const createdAt = infusionDate.toISOString()

    const type = infusionTypes[Math.floor(Math.random() * infusionTypes.length)]
    const site = sites[Math.floor(Math.random() * sites.length)]
    const cause = causes[Math.floor(Math.random() * causes.length)]

    // Vary units between 2000-4000
    const units = Math.floor(Math.random() * 2000) + 2000

    const infusion: TreatmentType = {
      deletedAt: null,
      cause,
      createdAt,
      date: dateStr,
      medication: {
        brand: medicationBrand,
        units,
        lot: `LOT${Math.floor(Math.random() * 10000)}`,
      },
      sites: site,
      type,
      user,
    }

    infusions.push(infusion)
  }

  // Sort by date (oldest first) for more realistic ordering
  infusions.sort((a, b) => a.date.localeCompare(b.date))

  // Create infusions in Firestore
  for (const infusion of infusions) {
    const cleanData = cleanUndefined(infusion)
    const docRef = await adminFirestore.collection('infusions').add(cleanData)
    await docRef.set({ uid: docRef.id, ...cleanData }, { merge: true })
  }

  console.log(`✓ Created ${count} infusions for user ${user.name}`)
}

async function seedUser() {
  const seedUserData = {
    name: 'Seed User',
    hemophiliaType: 'A',
    severity: 'Moderate',
    medication: 'Advate',
    injectionFrequency: 'Every 3 days',
    factor: 8,
  }

  // Seed user is separate from test sign-in user
  // This user is for seeding data only, not for authentication
  const alertId = 'mike29'
  const seedEmail = `seed-${alertId}@hemolog.com`

  try {
    let userUid: string
    let userDocData: Person

    // Check if user document already exists by alertId
    const existingUserQuery = await adminFirestore
      .collection('users')
      .where('alertId', '==', alertId)
      .limit(1)
      .get()

    if (!existingUserQuery.empty) {
      const existingDoc = existingUserQuery.docs[0]
      userUid = existingDoc.id
      userDocData = existingDoc.data() as Person
      console.log(
        `✓ Seed user with alertId '${alertId}' already exists with uid: ${userUid}`
      )
      console.log('Updating existing seed user document...')

      // Ensure uid field matches document ID for consistency
      const userData: Partial<Person> = {
        alertId,
        uid: userUid,
        ...seedUserData,
      }

      const cleanData = cleanUndefined(userData)
      await existingDoc.ref.update(cleanData)
      // Update userDocData to reflect the updated data
      userDocData = { ...userDocData, ...cleanData } as Person
      console.log(`✓ Updated seed user document with alertId '${alertId}'`)
    } else {
      // Create new seed user document
      // Use a consistent UID for the seed user (not tied to Firebase Auth)
      userUid = `seed-uid-${alertId}`

      const userData: Person = {
        alertId,
        uid: userUid,
        ...seedUserData,
      }

      const cleanData = cleanUndefined(userData)
      await adminFirestore.collection('users').doc(userUid).set(cleanData)
      userDocData = userData
      console.log(
        `✓ Created seed user document with alertId '${alertId}' and uid '${userUid}'`
      )
      console.log('User data:', JSON.stringify(cleanData, null, 2))
    }

    // Create AttachedUserType for infusions
    // Ensure uid matches what's stored in the Person document
    const attachedUser: AttachedUserType = {
      uid: userDocData.uid || userUid,
      name: seedUserData.name,
      email: seedEmail,
      photoUrl: userDocData.photoUrl || '',
    }

    console.log(`Creating infusions with user.uid: ${attachedUser.uid}`)
    console.log(`Person document uid: ${userDocData.uid}`)

    // Create 10 infusions
    await seedInfusions(attachedUser, seedUserData.medication, 10)
  } catch (error) {
    console.error('Error seeding user:', error)
    process.exit(1)
  }
}

// Run the seed function
checkEmulatorMode()
seedUser()
  .then(() => {
    console.log('Seed completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Seed failed:', error)
    process.exit(1)
  })
