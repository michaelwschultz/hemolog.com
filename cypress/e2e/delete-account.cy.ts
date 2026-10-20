// E2E coverage for delete-account against the Firebase emulators, so the
// shared Test User fixture is never touched.
//
// Emulator ports come from firebase.emulator.json (auth 9099, firestore 8082).
// The API route verifies tokens via FIREBASE_AUTH_EMULATOR_HOST from
// src/lib/firebase-admin.ts, which must point at the same Auth emulator.

const AUTH_EMULATOR_URL = 'http://localhost:9099'
const FIRESTORE_BASE =
  'http://localhost:8082/v1/projects/hemolog/databases/(default)/documents'

const createUser = (
  email: string,
  password: string
): Cypress.Chainable<{
  localId: string
  idToken: string
}> =>
  cy
    .request({
      method: 'POST',
      url: `${AUTH_EMULATOR_URL}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=local-emulator`,
      body: { email, password, returnSecureToken: true },
    })
    .then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.localId).to.be.a('string').and.not.empty
      expect(response.body.idToken).to.be.a('string').and.not.empty
      return { localId: response.body.localId, idToken: response.body.idToken }
    })

describe('delete account', () => {
  const stamp = Date.now()
  const email = `delete-${stamp}@hemolog.com`
  const password = `pw-${stamp}-delete`
  const infusionIds = [`delete-test-${stamp}-a`, `delete-test-${stamp}-b`]
  let localId: string
  let idToken: string

  before(() => {
    // 1. Create a throwaway Auth user, then seed documents (values are only
    //    available after the auth request resolves, so seeding must chain).
    createUser(email, password).then((authUser) => {
      localId = authUser.localId
      idToken = authUser.idToken

      // 2. Seed a users document.
      cy.request({
        method: 'POST',
        url: `${FIRESTORE_BASE}/users?documentId=${localId}`,
        body: {
          fields: {
            uid: { stringValue: localId },
            email: { stringValue: email },
            name: { stringValue: 'Delete Test User' },
          },
        },
      }).then((response) => expect(response.status).to.eq(200))

      // 3. Seed two infusion documents owned by the throwaway user.
      infusionIds.forEach((infusionId, index) => {
        cy.request({
          method: 'POST',
          url: `${FIRESTORE_BASE}/infusions?documentId=${infusionId}`,
          body: {
            fields: {
              uid: { stringValue: infusionId },
              cause: { stringValue: 'Delete test' },
              createdAt: {
                stringValue: `2024-01-0${index + 1}T00:00:00.000Z`,
              },
              date: { stringValue: `2024-01-0${index + 1}` },
              deletedAt: { nullValue: null },
              medication: {
                mapValue: {
                  fields: {
                    brand: { stringValue: 'Test Brand' },
                    units: { integerValue: '100' },
                  },
                },
              },
              sites: { stringValue: 'Left arm' },
              type: { stringValue: 'Prophy' },
              user: {
                mapValue: {
                  fields: {
                    uid: { stringValue: localId },
                    email: { stringValue: email },
                    name: { stringValue: 'Delete Test User' },
                    photoUrl: { stringValue: '' },
                  },
                },
              },
            },
          },
        }).then((response) => expect(response.status).to.eq(200))
      })
    })
  })

  it('deletes the Auth account and all Firestore data', () => {
    // 4. Exercise the real route.
    cy.request({
      method: 'DELETE',
      url: '/api/delete-account',
      headers: { token: idToken },
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.deep.equal({ success: true })
    })

    // 5. Verify the Auth account is gone.
    cy.request({
      method: 'POST',
      url: `${AUTH_EMULATOR_URL}/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=local-emulator`,
      body: { email, password, returnSecureToken: false },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400)
      expect(response.body.error.message).to.eq('EMAIL_NOT_FOUND')
    })

    // 6. Verify the users document is gone.
    cy.request({
      method: 'GET',
      url: `${FIRESTORE_BASE}/users/${localId}`,
      failOnStatusCode: false,
    }).then((response) => expect(response.status).to.eq(404))

    // 7. Verify both infusion documents are gone.
    infusionIds.forEach((infusionId) => {
      cy.request({
        method: 'GET',
        url: `${FIRESTORE_BASE}/infusions/${infusionId}`,
        failOnStatusCode: false,
      }).then((response) => expect(response.status).to.eq(404))
    })
  })
})
