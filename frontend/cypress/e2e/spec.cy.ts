describe('Test Table (meta-data and data) CRUD', () => {
  // beforeEach(() => {
  //   cy.task('resetDatabase'); // Custom task to clear the DB
  // });
  const url = 'http://172.19.0.4:5173'
  before(() => {
    cy.task('resetDatabaseTablesTest').then((result) => {
      cy.log('Database reset result:', JSON.stringify(result));
    });
    cy.visit(`${url}/register/admin`);
    cy.get("[data-cy='username-input']").type("Admin 1");
    cy.get("[data-cy='password-input']").type("1234567");
    cy.get("[data-cy='password-confirmation-input']").type("1234567");

    cy.contains('Register').click();

    cy.get("[data-cy='header']").should('exist')
    cy.contains('Logout').click()
  }),
    beforeEach(() => {
      cy.visit(`${url}/login`);
      cy.get("[data-cy='username-login-input']").type("Admin 1");
      cy.get("[data-cy='password-login-input']").type("1234567");

      cy.contains('Submit').click();
      cy.get("[data-cy='header']").should('exist')
    }),
    it('should test menu', () => {
      cy.get("[data-cy='header']").should('exist')
      cy.get("[data-cy='burguer-menu-input']").click()

      cy.get("[data-cy='tree-view']").should('exist')

      cy.contains('Dashboards').click()

      cy.contains('root').click()

      cy.get("[data-cy='tree-view__open-box-btn']").click()

      cy.get("[data-cy='tree-view__create-view__input']").type("foo")

      cy.get("[data-cy='tree-view__create-view__create-btn']").click()
    }),
    it('should do the CRUD of table-metadata and table-data', () => {
      cy.get("[data-cy='header']").should('exist')

      cy.get("[data-cy='burguer-menu-input']").should('exist')

      cy.get("[data-cy='read-tables-aggrid']").should('exist')

      cy.get("[data-cy='grid-add-btn']").click();

      cy.get('[data-cy="create-table-name-input"]').type('Table 1');

      cy.contains('Add').click();

      cy.get('[data-cy="create-table-col-def-input-0"]').type('column 1');

      cy.get("[data-cy='grid-add-btn']").click();

      cy.get('[data-cy="create-table-col-def-input-1"]').type('column 2');

      cy.contains('Create').click()

      cy.contains('Table created!').should('exist')

      cy.get("[data-cy='burguer-menu-input']").click()

      cy.contains('Tables').click()

      cy.get('[data-cy="burguer-menu-input"]').click()

      cy.contains('Table 1').should('exist')

      cy.contains('Update Mode').click()

      cy.get('.fa-solid.fa-pen-to-square').click();

      cy.get("[data-cy='update-table-view-input']").type('foo');

      cy.contains('Update').click()
    }),
    it.skip('update table', () => {

      cy.visit(`${url}/tables/read`);

      cy.contains('Update Mode').click()
      cy.contains('Table 1').next().get('.ag-cell[col-id="update-mode"]').click()

      cy.get("[data-cy='update-table-view-input']").type('Table 2');

      cy.contains('Update').click()

      cy.contains('Success').should('exist');
    }),
    it('should do the CRUD of table-metadata (editing on grid-add-btn) and table-data', () => {

      cy.get("[data-cy='header']").should('exist')

      cy.get("[data-cy='burguer-menu-input']").should('exist')

      cy.get("[data-cy='read-tables-aggrid']").should('exist')

      cy.get("[data-cy='edit-on-grid-toggle']").click()

      cy.get(`[role="row"][row-index="1"]`).dblclick()

      cy.get(`[role="row"][row-index="1"]`).type('Table 2{enter}')

      cy.contains('Table saved.').should('exist')

      cy.get(`[data-cy="grid-action-refresh-btn"]`).click()

      cy.wait(3000)


      cy.contains('Update Mode').click()

      cy.contains('Table 2')

      cy.get(`[role="row"][row-index="1"]`).find("[data-cy='update-row-icon-pen']").click()


      cy.get('[data-cy="update-table-view-input"]')
        .should('have.value', 'Table 2');

      cy.contains('Add').click();

      cy.get('[data-cy="create-table-col-def-input-0"]').type('column 1');

      cy.contains('Add').click();

      cy.get('[data-cy="create-table-col-def-input-1"]').type('column 2');

      cy.contains('Update').click()

      cy.contains('Table updated successfully').should('exist')

      //cy.contains('Table 2').click()



      //    cy.get('[data-cy="create-table-col-def-input-0"]').type('column 1');

      //    cy.get("[data-cy='grid-add-btn']").click();

      //    cy.get('[data-cy="create-table-col-def-input-1"]').type('column 2');

      //    cy.contains('Create').click()

      //    cy.wait(2000)

      //    cy.contains('Table created!').should('exist')

      //    cy.get("[data-cy='burguer-menu-input']").click()


      //    cy.contains('Tables').click()

      //    cy.get('[data-cy="burguer-menu-input"]').click()

      //    cy.contains('Table 1').should('exist')

      //    cy.wait(5000)

      //    cy.contains('Update Mode').click()

      //    cy.wait(2000)

      //    cy.get('.fa-solid.fa-pen-to-square').click();

      //    cy.get("[data-cy='update-table-view-input']").type('Table 2');

      //    cy.contains('Update').click()
    }),
    it('should do the CRUD of table-metadata and table-data', () => {

      cy.get("[data-cy='header']").should('exist')
      cy.get("[data-cy='burguer-menu-input']").should('exist')
      cy.get("[data-cy='burguer-menu-input']").click()
    }),
    it("should create a table-data row", () => {
      //     cy.visit(`${url}/login`);
      //cy.get("[data-cy='edit-on-grid-toggle']").click()
      cy.visit(`${url}/tables/read`)
      cy.contains('Table 1').should('be.visible')
      cy.wait(6000)
      cy.contains('Update Mode').click()

      cy.contains('Table 1').siblings("[col-id='update-mode']").find('[data-cy="update-row-icon-pen"]').click()

      cy.get('[data-testid="update-view-col-1"]').find("[data-testid='update-view-col-1-delete-btn']").click()
      cy.get('[data-testid="update-view-col-0"]').find("[data-testid='update-view-col-0-delete-btn']").click()

      cy.contains('Add').click()

      cy.get('[data-cy="create-table-col-def-input-0"]').type('column 1');

      cy.get('[data-cy="create-table-col-def-type-0"]').select('text')

      cy.contains('Add').click()

      cy.get('[data-cy="create-table-col-def-input-1"]').type('column 2');

      cy.get('[data-cy="create-table-col-def-type-1"]').select('text')

      cy.contains('Update').click()

      cy.contains('Table updated successfully').should('exist')

      cy.visit(`${url}/tables/read`)

      cy.contains('Table 1').click()

      cy.contains('Table 1').should('be.visible')

      cy.contains('column 1').should('exist')

      cy.wait(3000)

      cy.get("[data-cy='edit-on-grid-toggle']").click()

      cy.get(`[role="row"][row-index="0"]`).find('[col-id="column_1"]').dblclick()

      cy.get(`[role="row"][row-index="0"]`).find('[col-id="column_1"]').type('Foo')

      cy.get(`[role="row"][row-index="0"]`).find('[col-id="column_2"]').type('Bar{enter}')

      cy.contains('Table row created.').should('exist')

      cy.get(`[data-cy="grid-action-refresh-btn"]`).click()

      cy.get(`[role="row"][row-index="0"]`).find('[col-id="column_1"]').should('have.text', 'Foo')
    }),
    it.skip('should get unauthorized page', () => {
      cy.task('log', 'This will be output to the terminal');

      cy.visit(`${url}/login`);

      cy.task('log', 'foobar2');

      cy.contains('Submit').click();

      cy.visit(`${url}/tables/read`);

      cy.get("[data-cy='grid-add-btn']").click();

      cy.get('[data-cy="create-table-name-input"]').type('Table 1');

      cy.contains('Add').click();

      cy.get('[data-cy="create-table-col-def-input-0"]').type('column 1');

      cy.get("[data-cy='grid-add-btn']").click();

      cy.get('[data-cy="create-table-col-def-input-1"]').type('column 2');

      cy.get('[data-cy="create-table-col-def-type-1"]').select('Text');

      cy.get('[data-cy="create-table-col-def-filter-off-1"]').click();

      cy.get('[data-cy="create-table-col-def-sort-off-1"]').click();

      cy.get("[data-cy='create-table-btn']").click();

      cy.contains('Success').should('exist');

      cy.get("[data-cy='create-table-btn']").click();

      cy.contains('Error').should('exist');

      cy.visit(`${url}/tables/read`);

      cy.contains('Table 1').should('exist');

      cy.contains('Table 1').click();

      cy.url().should('include', '/table/data/read');

      cy.get("[data-cy='grid-add-btn']").click();

      cy.get('[data-cy=new-entry-form-0-text-input]').type('foo');

      cy.get('[data-cy=new-entry-form-1-text-input]').type('bar');

      cy.contains('Submit').click();

      cy.contains('Table row created.').should('exist');

      // const button = cy.get('[data-cy=new-entry-form-1-text-input]').type('bar');

      // cy.task('log', `$button = ${button}`);

      // cy.log(`${button}`);

      cy.contains('Delete Mode').click();

      cy.get('.ag-cell[aria-colindex="1"][col-id="delete-mode"] input').click();

      cy.get("[data-cy='grid-delete-btn']").click();

      cy.contains('Row deleted successfully').should('exist');

      cy.visit(`${url}/tables/read`);

      cy.contains('Table 1').should('exist');
      cy.contains('Delete Mode').click();

      cy.get('.ag-cell[aria-colindex="1"][col-id="delete-mode"] input').click();

      cy.get("[data-cy='grid-delete-btn']").click();

      cy.contains('Success').should('exist');

      cy.task('log', 'Test finished.');
    });
});
