describe('Test auth user views', () => {
  before(() => {
    cy.task('resetDatabaseUsers').then((result) => {
      cy.log('Database reset result:', JSON.stringify(result));
    });
    cy.visit(`/register/user`)

    cy.contains('Username').siblings('input').click().type('User 1')

    cy.contains('Password').siblings('input').click().type('1234567')

    cy.contains('Password Confirmation').siblings('input').click().type('1234567')

    cy.contains('Submit').click()

    //cy.wait(8000)

    cy.get("[data-cy='header']").should('exist')

    cy.contains('Logout').click()


    cy.visit(`/register/admin`);
    cy.get("[data-cy='username-input']").type("Admin 1");
    cy.get("[data-cy='password-input']").type("1234567");
    cy.get("[data-cy='password-confirmation-input']").type("1234567");

    cy.contains('Register').click();


    cy.get("[data-cy='header']").should('exist')
    cy.contains('Logout').click()
  }),
    beforeEach(() => {
      cy.visit(`/login`);
      cy.get("[data-cy='username-login-input']").type("Admin 1");
      cy.get("[data-cy='password-login-input']").type("1234567");

      cy.contains('Submit').click();

      cy.contains('Logout')

    })
  it('should create an user', () => {
    cy.visit('https://example.cypress.io')
  })
})
