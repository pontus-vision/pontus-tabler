
it('should associate user to group and group to dashboards', () => {
  cy.visit(`${url}/dashboards`)

  cy.get("[data-cy='grid-add-btn']").click();

  cy.get("[data-cy='dashboard-view-name-input']").type('Dash 1')

  cy.get("[data-cy='dashboard-view-open-directory']").click();

  cy.wait(3500)

  cy.contains('root').click()

  cy.get("[data-cy='dashboard-view-close-tree']").click('bottomRight');

  cy.wait(2000)

  cy.get("[data-cy='cmp-panel-select-tables']").select('table_1');

  cy.get("[data-cy='cmp-panel-select-graphics']").select("donut-chart")

  cy.wait(1500)

  cy.contains("Save State").click()
