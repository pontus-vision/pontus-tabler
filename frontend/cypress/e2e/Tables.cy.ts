describe('Test auth user views', () => {
  const nodeAppUrl = Cypress.env('nodeAppUrl');
  const url = `${nodeAppUrl || 'http://172.19.0.3:5173'}`
  before(() => {
    cy.task('resetDatabaseUsers').then((result) => {
      cy.log('Database reset result:', JSON.stringify(result));
    });
    cy.visit(`${url}/register/admin`);
    cy.get("[data-cy='username-input']").type("Admin 1");
    cy.get("[data-cy='password-input']").type("1234567");
    cy.get("[data-cy='password-confirmation-input']").type("1234567");

    cy.contains('Register').click();

    cy.wait(8000)

    cy.get("[data-cy='header']").should('exist')
    cy.contains('Logout').click()
  }),
    beforeEach(() => {
      cy.visit(`${url}/login`);
      cy.get("[data-cy='username-login-input']").type("Admin 1");
      cy.get("[data-cy='password-login-input']").type("1234567");

      cy.contains('Submit').click();

      cy.wait(5000)
    }),
    it('should create an user', () => {
      cy.visit('https://example.cypress.io')
    })
})
