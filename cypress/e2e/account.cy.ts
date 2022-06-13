describe('Acccounts', () => {
  it('can create an acccount', () => {
    cy.visit('/signin')
    cy.get('button > div').contains('Continue with Test User').click()
    cy.url().should('include', '/home')
    cy.contains('Insights')
    cy.contains('Annual overview')
    cy.contains('Treatments')
  })
})

export {}
