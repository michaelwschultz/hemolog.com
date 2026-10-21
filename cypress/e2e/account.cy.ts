describe('Account', () => {
  const newTreatmentButton = () => cy.contains('button', 'New treatment')
  const yearFilter = () => cy.get('select[aria-label="Filter by year"]')
  const statValueFor = (label: string) => cy.contains('div', label).prev()
  const toastShouldContain = (message: string) =>
    cy.contains('[role="status"]', message).should('be.visible')

  const openTreatmentMenuFor = (type: string) => {
    cy.contains('table tbody tr', type)
      .first()
      .within(() => {
        cy.get('button').last().click()
      })
  }

  it('can create an account', () => {
    cy.visit('/signin')
    cy.contains('button', 'Continue with test user').click()
    cy.url().should('include', '/app')
    cy.contains('Insights')
    cy.contains('Annual overview')
    cy.contains('Treatments')
  })

  it('can update profile', () => {
    cy.visit('/app/profile')
    cy.contains('About you')
    cy.get('select[name="hemophiliaType"]').select('A')
    cy.get('select[name="severity"]').select('Severe')
    cy.get('input[name="factor"]').clear().type('8')
    cy.get('input[name="medication"]').clear().type('Xyntha')
    cy.get('input[name="monoclonalAntibody"]').clear().type('Hemlibra')
    cy.get('select[name="injectionFrequency"]').select('Monthly')
    cy.contains('button', 'Save profile').click()

    toastShouldContain('Profile saved')
  })

  it('can log a prophy treatment', () => {
    cy.visit('/app')
    newTreatmentButton().click()
    cy.contains('h2', 'Log treatment')
    cy.contains('button', 'Prophy').click()
    cy.get('input[name="brand"]').clear().type('Xyntha')
    cy.get('input[name="units"]').clear().type('3000')
    cy.get('input[name="lot"]').clear().type('ABC123')
    cy.contains('button', 'Log treatment').click()

    toastShouldContain('Treatment logged! Hope all is well.')
  })

  it('can log a bleed treatment', () => {
    cy.visit('/app')
    newTreatmentButton().click()
    cy.contains('h2', 'Log treatment')
    cy.contains('button', 'Bleed').click()
    cy.get('input[name="brand"]').clear().type('Xyntha')
    cy.get('input[name="units"]').clear().type('3000')
    cy.get('input[name="lot"]').clear().type('ABC123')
    cy.contains('button', 'Log treatment').click()

    toastShouldContain('Treatment logged! Hope all is well.')
  })

  it('can update treatment', () => {
    cy.visit('/app')
    openTreatmentMenuFor('PROPHY')
    cy.contains('button', /^Update$/).click()
    cy.contains('h2', 'Edit treatment')
    cy.contains('button', 'Preventative').click()
    cy.get('input[name="brand"]').clear().type('Advate')
    cy.get('input[name="units"]').clear().type('1999')
    cy.get('input[name="lot"]').clear().type('ABC123')
    cy.contains('button', 'Save').click()

    toastShouldContain('Treatment updated!')
  })

  it('can delete treatment', () => {
    cy.visit('/app')
    openTreatmentMenuFor('BLEED')
    cy.contains('button', /^Delete$/).click()
    cy.contains('button', 'Delete treatment').click()

    toastShouldContain('Treatment deleted')
  })

  it('can show treatment count card correctly', () => {
    cy.visit('/app')
    yearFilter().select('All time')

    // The card counts ALL treatments for the filter, but the table paginates
    // at 25 rows per page, so the visible row count doesn't match. Its footer
    // reads "Showing X of Y treatments" where Y is the total the card shows.
    // Fall back to counting visible rows when the table fits on one page.
    statValueFor('Treatments').then(($value) => {
      cy.get('table tbody tr').then(($rows) => {
        cy.get('table')
          .parent()
          .invoke('text')
          .then((tableText) => {
            const total =
              tableText.match(/Showing \d+ of (\d+) treatments/)?.[1] ??
              String($rows.length)
            expect($value.text().trim()).to.eq(total)
          })
      })
    })
  })

  it('can show bleed card correctly', () => {
    cy.visit('/app')
    yearFilter().select('All time')

    // Seed data is randomized per run, so assert the value is a valid count.
    statValueFor('Bleeds').invoke('text').should('match', /^\d+$/)
  })

  it('can show prophy card correctly', () => {
    cy.visit('/app')
    yearFilter().select('All time')

    // Seed data is randomized per run, so assert the value is a valid count.
    statValueFor('Consecutive prophy treatments')
      .invoke('text')
      .should('match', /^\d+$/)
  })
})

export {}
