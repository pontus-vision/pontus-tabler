describe('Test Table (meta-data and data) CRUD', () => {
  it('should do the CRUD of table-metadata and table-data', async () => {
    cy.task('log', 'This will be output to the terminal');

    cy.task('log', 'Hello');

    cy.task('log', 'foobar');
    cy.task('log', 'foobar');
    cy.task('log', 'foobar');
    cy.task('log', 'foobar2');

    // cy.log('Hello');

    cy.visit('http://localhost:5173/login');

    cy.task('log', 'foobar2');

    cy.contains('Submit').click();

    cy.visit('http://localhost:5173/tables/read');

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

    cy.visit('http://localhost:5173/tables/read');

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

    cy.wait(2000);

    cy.contains('Delete Mode').click();

    cy.get('.ag-cell[aria-colindex="1"][col-id="delete-mode"] input').click();

    cy.get("[data-cy='grid-delete-btn']").click();

    cy.contains('Row deleted successfully').should('exist');

    cy.visit('http://localhost:5173/tables/read');

    cy.wait(2000);

    cy.contains('Table 1').should('exist');
    cy.contains('Delete Mode').click();

    cy.get('.ag-cell[aria-colindex="1"][col-id="delete-mode"] input').click();

    cy.get("[data-cy='grid-delete-btn']").click();

    cy.contains('Success').should('exist');

    cy.task('log', 'Test finished.');
  });
});
