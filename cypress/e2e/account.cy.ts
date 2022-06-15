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
    cy.get('input[name="hemophiliaType"]').clear().type('A')
    cy.get('input[name="severity"]').clear().type('Severe')
    cy.get('input[name="factor"]').clear().type('8')
    cy.get('input[name="medication"]').clear().type('Xyntha')
    cy.get('input[name="monoclonalAntibody"]').clear().type('Hemlibra')
    cy.get('input[name="injectionFrequency"]').clear().type('Monthly')
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
    cy.get('input[name="brand"]').clear().type('Xyntha')
    cy.get('input[name="units"]').clear().type('3000')
    cy.get('input[name="lot"]').clear().type('ABC123')
    cy.get('button > div').contains('Log Treatment').click()

    cy.contains(
      '#geist-ui-toast .message',
      'Treatment logged! Hope all is well.'
    ).should('be.visible')
  })

  it('can log a bleed treatment', () => {
    cy.visit('/home')
    cy.get('button > div').contains('New treatment').click()
    cy.get('h2').contains('Treatment')
    cy.get('button > div').contains('Bleed').click()
    cy.get('input[name="brand"]').clear().type('Xyntha')
    cy.get('input[name="units"]').clear().type('3000')
    cy.get('input[name="lot"]').clear().type('ABC123')
    cy.get('button > div').contains('Log Treatment').click()

    cy.contains(
      '#geist-ui-toast .message',
      'Treatment logged! Hope all is well.'
    ).should('be.visible')
  })

  it('can update treatment', () => {
    cy.visit('/home')
    cy.get('table tr td')
      .contains('PROPHY')
      .parent()
      .parent()
      .siblings()
      .find('div.tooltip')
      .click()
    cy.get('div').contains('Update').click()
    cy.get('h2').contains('Treatment')
    cy.get('button > div').contains('Preventative').click()
    cy.get('input[name="brand"]').clear().type('Advate')
    cy.get('input[name="units"]').clear().type('1999')
    cy.get('input[name="lot"]').clear().type('ABC123')
    cy.get('button > div').contains('Update Treatment').click()

    cy.contains('#geist-ui-toast .message', 'Treatment updated!').should(
      'be.visible'
    )
  })

  it('can delete treatment', () => {
    cy.visit('/home')
    cy.get('table tr td')
      .contains('BLEED')
      .parent()
      .parent()
      .siblings()
      .find('div.tooltip')
      .click()
    cy.get('div').contains('Delete').click()

    cy.contains('#geist-ui-toast .message', 'Treatment deleted.').should(
      'be.visible'
    )
  })

  it('can show treatment count card correctly', () => {
    cy.visit('/home')
    cy.get('.card').contains('Treatments').parent().find('h3').contains(1)
  })

  it('can show bleed card correctly', () => {
    cy.visit('/home')
    cy.get('.card').contains('Bleeds').parent().find('h3').contains(0)
  })

  it('can show prophy card correctly', () => {
    cy.visit('/home')
    cy.get('.card')
      .contains('Consecutive prophy treatments')
      .parent()
      .find('h3')
      .contains(0)
  })
})

export {}
