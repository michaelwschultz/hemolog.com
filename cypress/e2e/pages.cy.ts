describe('Pages render', () => {
  it('can visit landing', () => {
    cy.visit('/')
  })

  it('can visit about', () => {
    cy.visit('/about')
  })

  it('can visit changelog', () => {
    cy.visit('/changelog')
  })

  it('can copy emergency link from landing', () => {
    cy.visit(`/`)

    cy.get('pre')
      .contains('/emergency/')
      .scrollIntoView()
      .invoke('text')
      .should('include', '/example')
    cy.get('.copy').click()

    cy.contains('#geist-ui-toast .message', 'Copied to clipboard!').should(
      'be.visible'
    )
  })
})

export {}
