// seed.ts
// Populate the Firebase emulators with demo users and treatments.
// Run with: pnpm seed
//
// IMPORTANT: This script only works with Firebase emulators for safety.
// It will refuse to run if emulators are not enabled.

import type { UserRecord } from 'firebase-admin/auth'
import {
  type TreatmentType,
  TreatmentTypeEnum,
  type TreatmentTypeOptions,
} from './db/treatments'
import { auth as adminAuth, adminFirestore } from './firebase-admin'
import { TEST_USER } from './testUser'
import type { Person } from './types/person'
import type { AttachedUserType } from './types/users'

function checkEmulatorMode() {
  const useEmulators = process.env.NEXT_PUBLIC_USE_EMULATORS === 'true'

  if (!useEmulators) {
    console.error(
      '❌ ERROR: This seed script can only run with Firebase emulators enabled.'
    )
    console.error('')
    console.error('To run this script, set NEXT_PUBLIC_USE_EMULATORS=true:')
    console.error('  pnpm seed')
    console.error('')
    console.error('Make sure Firebase emulators are running:')
    console.error('  pnpm firebase')
    process.exit(1)
  }

  if (!process.env.FIRESTORE_EMULATOR_HOST) {
    process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8082'
  }
  if (!process.env.FIREBASE_AUTH_EMULATOR_HOST) {
    process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099'
  }

  console.log('✓ Running in emulator mode (safe for local development)')
  console.log('')
}

function cleanUndefined<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined)
  ) as Partial<T>
}

const MONTHLY_LIMITS: {
  type: TreatmentTypeOptions
  max: number
  random?: boolean
}[] = [
  { type: TreatmentTypeEnum.PROPHY, max: 6, random: true },
  { type: TreatmentTypeEnum.PREVENTATIVE, max: 3 },
  { type: TreatmentTypeEnum.BLEED, max: 2, random: true },
  { type: TreatmentTypeEnum.ANTIBODY, max: 1 },
]

const SEED_MONTHS = 12
const HEMLIBRA = 'Hemlibra'

const BLEED_SITES = [
  'Left ankle',
  'Right ankle',
  'Left knee',
  'Right knee',
  'Left elbow',
  'Right elbow',
  'Hip',
]

const BLEED_CAUSES = [
  'Minor cut',
  'Bruise',
  'Joint pain',
  'Ran into a door',
  'Unknown',
]

const PREVENTATIVE_CAUSES = ['Before sports', 'Travel', 'Physical therapy']

function pad2(value: number): string {
  return String(value).padStart(2, '0')
}

function formatDate(year: number, monthIndex: number, day: number): string {
  return `${year}-${pad2(monthIndex + 1)}-${pad2(day)}`
}

function daysInMonth(year: number, monthIndex: number): number {
  return new Date(year, monthIndex + 1, 0).getDate()
}

function pickDays(available: number[], count: number): number[] {
  const pool = [...available]
  const picked: number[] = []
  const take = Math.min(count, pool.length)

  for (let i = 0; i < take; i++) {
    const index = Math.floor(Math.random() * pool.length)
    picked.push(pool.splice(index, 1)[0])
  }

  return picked.sort((a, b) => a - b)
}

function buildTreatment(
  user: AttachedUserType,
  type: TreatmentTypeOptions,
  date: string,
  medicationBrand: string
): TreatmentType {
  const isAntibody = type === TreatmentTypeEnum.ANTIBODY
  const isBleed = type === TreatmentTypeEnum.BLEED
  const isPreventative = type === TreatmentTypeEnum.PREVENTATIVE

  return {
    deletedAt: null,
    cause: isBleed
      ? BLEED_CAUSES[Math.floor(Math.random() * BLEED_CAUSES.length)]
      : isPreventative
        ? PREVENTATIVE_CAUSES[
            Math.floor(Math.random() * PREVENTATIVE_CAUSES.length)
          ]
        : '',
    createdAt: `${date}T12:00:00.000Z`,
    date,
    medication: isAntibody
      ? {
          brand: HEMLIBRA,
          units: 0,
        }
      : {
          brand: medicationBrand,
          units: Math.floor(Math.random() * 2000) + 2000,
          lot: `LOT${Math.floor(Math.random() * 10000)}`,
        },
    sites: isBleed
      ? BLEED_SITES[Math.floor(Math.random() * BLEED_SITES.length)]
      : '',
    type,
    user,
  }
}

async function deleteTreatmentsForUser(uid: string): Promise<void> {
  const snapshot = await adminFirestore
    .collection('infusions')
    .where('user.uid', '==', uid)
    .get()

  if (snapshot.empty) {
    return
  }

  const docs = snapshot.docs
  for (let i = 0; i < docs.length; i += 400) {
    const batch = adminFirestore.batch()
    for (const doc of docs.slice(i, i + 400)) {
      batch.delete(doc.ref)
    }
    await batch.commit()
  }
}

async function seedTreatments(
  user: AttachedUserType,
  medicationBrand: string
): Promise<void> {
  await deleteTreatmentsForUser(user.uid)

  const now = new Date()
  const treatments: TreatmentType[] = []

  for (let monthsAgo = SEED_MONTHS - 1; monthsAgo >= 0; monthsAgo--) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1)
    const year = monthDate.getFullYear()
    const monthIndex = monthDate.getMonth()
    const lastDay =
      monthsAgo === 0 ? now.getDate() : daysInMonth(year, monthIndex)
    const availableDays = Array.from({ length: lastDay }, (_, i) => i + 1)

    for (const { type, max, random } of MONTHLY_LIMITS) {
      const count = random ? Math.floor(Math.random() * (max + 1)) : max
      const days = pickDays(availableDays, count)
      for (const day of days) {
        const usedIndex = availableDays.indexOf(day)
        if (usedIndex !== -1) {
          availableDays.splice(usedIndex, 1)
        }
        treatments.push(
          buildTreatment(
            user,
            type,
            formatDate(year, monthIndex, day),
            medicationBrand
          )
        )
      }
    }
  }

  treatments.sort((a, b) => a.date.localeCompare(b.date))

  for (const treatment of treatments) {
    const cleanData = cleanUndefined(treatment)
    const docRef = await adminFirestore.collection('infusions').add(cleanData)
    await docRef.set({ uid: docRef.id, ...cleanData }, { merge: true })
  }

  console.log(
    `✓ Created ${treatments.length} treatments for ${user.name} over ${SEED_MONTHS} months`
  )
}

async function upsertPerson(
  uid: string,
  userData: Person & { email?: string }
): Promise<Person> {
  const existing = await adminFirestore.collection('users').doc(uid).get()
  const cleanData = cleanUndefined({ ...userData, uid })

  if (existing.exists) {
    await existing.ref.set(cleanData, { merge: true })
    console.log(`✓ Updated user document ${uid}`)
    return { ...(existing.data() as Person), ...cleanData } as Person
  }

  await adminFirestore.collection('users').doc(uid).set(cleanData)
  console.log(`✓ Created user document ${uid}`)
  return cleanData as Person
}

async function getOrCreateAuthUser(): Promise<UserRecord> {
  try {
    const existing = await adminAuth.getUserByEmail(TEST_USER.email)
    if (!existing.displayName) {
      await adminAuth.updateUser(existing.uid, {
        displayName: TEST_USER.name,
      })
    }
    console.log(
      `✓ Auth user ${TEST_USER.email} already exists (${existing.uid})`
    )
    return existing
  } catch (error: unknown) {
    const code =
      error && typeof error === 'object' && 'code' in error
        ? String(error.code)
        : ''

    if (code !== 'auth/user-not-found') {
      throw error
    }
  }

  const created = await adminAuth.createUser({
    email: TEST_USER.email,
    password: TEST_USER.password,
    displayName: TEST_USER.name,
    emailVerified: true,
  })
  console.log(`✓ Created auth user ${TEST_USER.email} (${created.uid})`)
  return created
}

async function seedEmergencyUser(): Promise<void> {
  const seedUserData = {
    name: 'Seed User',
    hemophiliaType: 'A',
    severity: 'Moderate',
    medication: 'Advate',
    monoclonalAntibody: HEMLIBRA,
    injectionFrequency: 'Every 3 days',
    factor: 8,
  }

  const alertId = 'mike29'
  const seedEmail = `seed-${alertId}@hemolog.com`
  let userUid = `seed-uid-${alertId}`

  const existingUserQuery = await adminFirestore
    .collection('users')
    .where('alertId', '==', alertId)
    .limit(1)
    .get()

  if (!existingUserQuery.empty) {
    userUid = existingUserQuery.docs[0].id
  }

  const person = await upsertPerson(userUid, {
    alertId,
    uid: userUid,
    ...seedUserData,
  })

  const attachedUser: AttachedUserType = {
    uid: person.uid || userUid,
    name: seedUserData.name,
    email: seedEmail,
    photoUrl: person.photoUrl || '',
  }

  await seedTreatments(attachedUser, seedUserData.medication)
}

async function seedTestUser(): Promise<void> {
  const authUser = await getOrCreateAuthUser()

  const person = await upsertPerson(authUser.uid, {
    uid: authUser.uid,
    email: TEST_USER.email,
    name: TEST_USER.name,
    alertId: TEST_USER.alertId,
    apiKey: TEST_USER.apiKey,
    hemophiliaType: TEST_USER.hemophiliaType,
    severity: TEST_USER.severity,
    medication: TEST_USER.medication,
    monoclonalAntibody: TEST_USER.monoclonalAntibody,
    injectionFrequency: TEST_USER.injectionFrequency,
    factor: TEST_USER.factor,
  })

  const attachedUser: AttachedUserType = {
    uid: authUser.uid,
    name: TEST_USER.name,
    email: TEST_USER.email,
    photoUrl: person.photoUrl || authUser.photoURL || '',
  }

  await seedTreatments(attachedUser, TEST_USER.medication)
  console.log(
    `✓ Test user ready. Sign in with "${TEST_USER.email}" / "${TEST_USER.password}"`
  )
}

checkEmulatorMode()
Promise.all([seedEmergencyUser(), seedTestUser()])
  .then(() => {
    console.log('')
    console.log('Seed completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Seed failed:', error)
    process.exit(1)
  })
