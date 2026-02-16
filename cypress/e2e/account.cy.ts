describe('Acccounts', () => {
  const newTreatmentButton = () => cy.contains('button', 'New treatment')
  const treatmentModalHeading = () =>
    cy.contains('h3', /Log Treatment|Edit Treatment/)
  const toastShouldContain = (message: string) =>
    cy.contains('[role="status"]', message).should('be.visible')

  const openTreatmentMenuFor = (type: string) => {
    cy.contains('table tbody tr', type)
      .first()
      .within(() => {
        cy.get('button').last().click()
      })
  }

  it('can create an acccount', () => {
    cy.visit('/signin')
    cy.contains('button', 'Continue with Test User').click()
    cy.url().should('include', '/home')
    cy.contains('Insights')
    cy.contains('Annual overview')
    cy.contains('Treatments')
  })

  it('can update profile', () => {
    cy.visit('/home')
    cy.findByRole('tab', { name: 'Profile' }).click()
    cy.contains('About you')
    cy.get('select[name="hemophiliaType"]').select('A')
    cy.get('select[name="severity"]').select('Severe')
    cy.get('input[name="factor"]').clear().type('8')
    cy.get('input[name="medication"]').clear().type('Xyntha')
    cy.get('input[name="monoclonalAntibody"]').clear().type('Hemlibra')
    cy.get('select[name="injectionFrequency"]').select('Monthly')
    cy.contains('button', 'Update').click()

    toastShouldContain('Profile updated!')
  })

  it('can log a prophy treatment', () => {
    cy.visit('/home')
    newTreatmentButton().click()
    treatmentModalHeading()
    cy.contains('button', 'Prophy').click()
    cy.get('input[name="brand"]').clear().type('Xyntha')
    cy.get('input[name="units"]').clear().type('3000')
    cy.get('input[name="lot"]').clear().type('ABC123')
    cy.contains('button', 'Save').click()

    toastShouldContain('Treatment logged! Hope all is well.')
  })

  it('can log a bleed treatment', () => {
    cy.visit('/home')
    newTreatmentButton().click()
    treatmentModalHeading()
    cy.contains('button', 'Bleed').click()
    cy.get('input[name="brand"]').clear().type('Xyntha')
    cy.get('input[name="units"]').clear().type('3000')
    cy.get('input[name="lot"]').clear().type('ABC123')
    cy.contains('button', 'Save').click()

    toastShouldContain('Treatment logged! Hope all is well.')
  })

  it('can update treatment', () => {
    cy.visit('/home')
    openTreatmentMenuFor('PROPHY')
    cy.contains('button', /^Update$/).click()
    treatmentModalHeading()
    cy.contains('button', 'Preventative').click()
    cy.get('input[name="brand"]').clear().type('Advate')
    cy.get('input[name="units"]').clear().type('1999')
    cy.get('input[name="lot"]').clear().type('ABC123')
    cy.contains('button', 'Save').click()

    toastShouldContain('Treatment updated!')
  })

  it('can delete treatment', () => {
    cy.visit('/home')
    openTreatmentMenuFor('BLEED')
    cy.contains('button', /^Delete$/).click()

    toastShouldContain('Treatment deleted')
  })

  it('can show treatment count card correctly', () => {
    cy.visit('/home')
    cy.contains('div', /^Treatments$/)
      .prev()
      .should('contain', '1')
  })

  it('can show bleed card correctly', () => {
    cy.visit('/home')
    cy.contains('div', /^Bleeds$/)
      .prev()
      .should('contain', '0')
  })

  it('can show prophy card correctly', () => {
    cy.visit('/home')
    cy.contains('div', /^Consecutive prophy treatments$/)
      .prev()
      .should('contain', '0')
  })
})

export {}
