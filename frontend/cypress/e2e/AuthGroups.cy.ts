describe('Test Table (meta-data and data) CRUD', () => {
  it('should do the CRUD of table-metadata and table-data', async () => {
    cy.visit('http://localhost:5173/login');

    cy.contains('Submit').click();

    cy.visit('http://localhost:5173/auth/groups');

    cy.get('[data-cy="auth-groups-grid"]').as('authGroupsGrid');

    cy.wait(5000);

    cy.get('@authGroupsGrid').find('[data-cy="grid-add-btn"]').click();
    cy.get('@authGroupsGrid')
      .find('div[tabindex="-1"][role="gridcell"][col-id="name"]')
      .should('exist')
      .dblclick()
      .type('AuthGroup')
      .type('{enter}');

    cy.contains('Success').should('exist');

    cy.get('[col-id="click"][role="gridcell"]').click();

    cy.get('[data-cy="group-dashboards-grid"]').as('groupDashboardsGrid');

    cy.wait(5000);

    cy.get('@groupDashboardsGrid').find('[data-cy="grid-add-btn"]').click();
    // cy.get('@groupDashboardsGrid')
    //   .find('div[tabindex="-1"][role="gridcell"][col-id="name"]')
    //   .should('exist')
    //   .dblclick()
    //   .type('AuthGroup')
    //   .type('{enter}');

    cy.get('[data-cy="dashboards-grid"]').as('dashboardsGrid');

    cy.wait(5000);

    cy.get('@dashboardsGrid').find('input.ag-checkbox-input').should('exist');

    cy.get('[role="dashboards-grid-select"]')
      .find('input.ag-checkbox-input')
      .should('exist')
      .click();

    cy.contains('Add Group(s)').should('exist').click()

    cy.contains('Success').should('exist')
    

    cy.get(
      'cy.ag-cell.ag-cell-normal-height.ag-cell-value.ag-cell-focus.ag-cell-inline-editing',
    ).type('authGroup');


    
  });
});
