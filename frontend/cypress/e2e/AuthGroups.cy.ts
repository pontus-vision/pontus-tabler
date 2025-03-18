import { should } from "chai";

describe('Test Table (meta-data and data) CRUD', () => {
  // beforeEach(() => {
  //   cy.task('resetDatabase'); // Custom task to clear the DB
  // });
  const url = 'http://172.19.0.4:5173'
  before(() => {
    cy.task('resetDatabaseAuthGroups').then((result) => {
      cy.log('Database reset result:', JSON.stringify(result));
    });
    cy.visit(`${url}/register/user`)

    cy.contains('Username').siblings('input').click().type('User 1')

    cy.contains('Password').siblings('input').click().type('1234567')

    cy.contains('Password Confirmation').siblings('input').click().type('1234567')

    cy.contains('Submit').click()

    //cy.wait(8000)

    cy.get("[data-cy='header']").should('exist')

    cy.contains('Logout').click()


    cy.visit(`${url}/register/admin`);
    cy.get("[data-cy='username-input']").type("Admin 1");
    cy.get("[data-cy='password-input']").type("1234567");
    cy.get("[data-cy='password-confirmation-input']").type("1234567");

    cy.contains('Register').click();


    cy.get("[data-cy='header']", { timeout: 10000 }).should('exist')
    cy.contains('Logout').click()
  }),
    beforeEach(() => {
      cy.visit(`${url}/login`);
      cy.get("[data-cy='username-login-input']").type("Admin 1");
      cy.get("[data-cy='password-login-input']").type("1234567");

      cy.contains('Submit').click();

      cy.contains('Logout', { timeout: 10000 })

    })
  it('should create an user', () => {
  })
  it('should associate user to group and group to dashboards', () => {
    cy.visit(`${url}/auth/groups`)

    cy.get("[data-cy='edit-on-grid-toggle']").click()

    cy.get(`[data-cy="grid-action-refresh-btn"]`).click()

    cy.contains('Loading...', { timeout: 10000 }).should('not.exist')

    cy.get("[row-index='1'] [col-id='name']", { timeout: 10000 }).dblclick({ force: true });

    cy.get("[row-index='1'] [col-id='name']", { timeout: 10000 }).type('Regular User{enter}');

    cy.contains('AuthGroup(s) created!', { timeout: 10000 }).should('exist')

    cy.get(`[data-cy="grid-action-refresh-btn"]`, { timeout: 10000 }).click()

    cy.get("[data-cy='edit-on-grid-toggle']").click()


    cy.contains('Regular User', { timeout: 10000 }).siblings('[col-id="click"]').dblclick()

    cy.contains('Regular User Dashboards:').next().find("[data-cy='grid-add-btn']").click();


    cy.contains('Dash 1', { timeout: 10000 }).siblings('[col-id="selection-mode"]').find('input').click()

    cy.contains('Add Group(s)').click()


    cy.contains('Success', { timeout: 10000 }).should('exist')
    cy.get('body').click('bottomLeft')
  })
})
