describe('Acccounts', () => {
  it('can create an acccount', () => {
    cy.visit('/signin')
    cy.get('button > div').contains('Continue with Test User').click()
    cy.url().should('include', '/home')
    cy.contains('Insights')
    cy.contains('Annual overview')
    cy.contains('Treatments')
  })

  it('can update profile', () => {
    cy.visit('/home')
    cy.findByRole('button', { name: 'Profile' }).click()
    cy.contains('About you')
    cy.get('input[name="hemophiliaType"]').type('A')
    cy.get('input[name="severity"]').type('Severe')
    cy.get('input[name="factor"]').type('8')
    cy.get('input[name="medication"]').type('Xyntha')
    cy.get('input[name="monoclonalAntibody"]').type('Hemlibra')
    cy.get('input[name="injectionFrequency"]').type('Monthly')
    cy.get('button').contains('Update').click()

    cy.contains('#geist-ui-toast .message', 'Profile updated!').should(
      'be.visible'
    )
  })

  it('can log a prophy treatment', () => {
    cy.visit('/home')
    cy.get('button > div').contains('New treatment').click()
    cy.get('h2').contains('Treatment')
    cy.get('button > div').contains('Prophy').click()
    cy.get('input[name="brand"]').type('Xyntha')
    cy.get('input[name="units"]').type('3000')
    cy.get('input[name="lot"]').type('ABC123')
    cy.get('button > div').contains('Log Treatment').click()

    cy.contains(
      '#geist-ui-toast .message',
      'Treatment logged! Hope all is well.'
    ).should('be.visible')
  })
})

export {}
