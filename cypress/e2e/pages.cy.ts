describe('Pages render', () => {
  it('can visit landing', () => {
    cy.visit('/')
  })

  it('can visit about', () => {
    cy.visit('/about')
  })

  it('can visit changelog', () => {
    cy.visit('/changelog')

    // Wait for the client to finish hydrating
    cy.get('body').should('have.attr', 'data-hydrated', 'true')
  })

  it('can copy emergency link from landing', () => {
    cy.visit(`/`)

    cy.get('body').should('have.attr', 'data-hydrated', 'true')

    cy.window().then((win) => {
      if (!win.navigator.clipboard) {
        Object.defineProperty(win.navigator, 'clipboard', {
          value: {
            writeText: () => Promise.resolve(),
          },
          writable: true,
        })
      }

      cy.stub(win.navigator.clipboard, 'writeText')
        .as('clipboardWrite')
        .resolves()
    })

    cy.contains('code', '/emergency/')

      .scrollIntoView()
      .invoke('text')
      .should('include', '/emergency/')

    cy.get('button[title="Copy to clipboard"]').click()

    cy.contains('[role="status"]', 'Link copied!').should('be.visible')
    cy.get('@clipboardWrite').should('have.been.called')
  })
})

export {}
