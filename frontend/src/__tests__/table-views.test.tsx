import {
  getByText,
  render,
  screen,
  waitFor,
  cleanup,
  fireEvent,
} from '@testing-library/react';
import CreateTableView from '../views/tables/CreateTable';
import { describe, it, expect, vi } from 'vitest';
import TableView from '../views/TableView';
import NewTableCol from '../components/NewTable/Column';
import { sendHttpRequest } from '../http';
import {
  DashboardCreateRes,
  DashboardsReadRes,
  TableColumnRef,
  TableCreateRes,
  TableReadRes,
  TablesReadRes,
} from '../pontus-api/typescript-fetch-client-generated';
import { AxiosResponse } from 'axios';
import TablesReadView from '../views/tables/ReadTables';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router-dom';
import UpdateTableView from '../views/tables/UpdateTable';
import App from '../App';
import { updateTable } from '../client';

const mockedUsedNavigate = vi.fn();

vi.mock('react-router-dom', async () => ({
  ...((await vi.importActual('react-router-dom')) as any),
  useNavigate: () => mockedUsedNavigate,
}));
const post = async (body: any, endpoint: string) => {
  return sendHttpRequest(
    'http://localhost:8080/PontusTest/1.0.0/' + endpoint,
    {
      'Content-Type': 'application/json',
      Authorization: 'Bearer 123456',
    },
    {},
    JSON.stringify(body),
  );
};

beforeEach(async () => {
  //Deleting records

  const tablesRes: AxiosResponse<TablesReadRes | undefined> = await post(
    {
      from: 1,
      to: 20,
      filters: {},
    },
    'tables/read',
  );

  tablesRes?.data?.tables?.forEach(async (table) => {
    if (!table?.id) return;
    const deleteRes = await post({ id: table?.id }, 'table/delete');

    expect(deleteRes).toBeTruthy();
  });
});

afterEach(() => {
  cleanup();
});

describe('TableViews', () => {
  it('should load components properly', async () => {
    const { unmount } = render(<CreateTableView />);

    await waitFor(() => {
      expect(
        (
          document?.querySelector(
            '.create-table__name-input',
          ) as HTMLInputElement
        )?.value,
      ).toBe('');
    });

    expect(screen.getByTestId('table-view'));
    unmount();
  });

  it('should render TableView cmp in "update-mode"', async () => {
    const { unmount } = render(<TableView onCreate={() => 'something'} />);

    expect(
      document?.querySelector(
        '.update-table-update-button',
      ) as HTMLInputElement,
    ).toBeTruthy();
    unmount();
  });

  it('should test if btns are behaving properly', async () => {
    const user = userEvent.setup();
    const { unmount, getByTestId, getByRole, container } = render(
      <NewTableCol testId="column-data" index={1} />,
    );

    const filterBtnUnchecked = document.querySelector(
      '.table-row__filter-icon--unchecked',
    );

    filterBtnUnchecked && (await user.click(filterBtnUnchecked));

    await waitFor(() => {
      const filterBtnChecked = document.querySelector(
        '.table-row__filter-icon--checked',
      );

      expect(filterBtnChecked).toBeTruthy();
    });

    const sortBtnUnchecked = document.querySelector(
      '.table-row__sort-icon--unchecked',
    );

    sortBtnUnchecked && (await user.click(sortBtnUnchecked));

    await waitFor(() => {
      const sortBtnChecked = document.querySelector(
        '.table-row__sort-icon--checked',
      );

      expect(sortBtnChecked).toBeTruthy();
    });

    const dropdownSelect = getByTestId(
      'column-data-dropdown',
    ) as HTMLSelectElement;

    expect(dropdownSelect.value).toBe('checkboxes');

    await user.selectOptions(dropdownSelect, 'selectbox');
    expect(dropdownSelect.value).toBe('selectbox');

    await user.selectOptions(dropdownSelect, 'text');
    expect(dropdownSelect.value).toBe('text');

    await user.selectOptions(dropdownSelect, 'email');
    expect(dropdownSelect.value).toBe('email');

    await user.selectOptions(dropdownSelect, 'zipcode');
    expect(dropdownSelect.value).toBe('zipcode');

    await user.selectOptions(dropdownSelect, 'selectbox');
    expect(dropdownSelect.value).toBe('selectbox');

    const input = getByTestId('column-data-input') as HTMLInputElement;

    userEvent.type(input, 'Test input');

    await waitFor(() => {
      expect(input.value).toBe('Test input');
    });

    unmount();
  });
  it.skip('should navigate between routes', async () => {
    window.history.pushState({}, '', '/dashboards/read');
    const { unmount } = render(<App />, {
      wrapper: BrowserRouter,
    });

    await waitFor(
      () => {
        expect(screen.getByTestId('header-logo')).toBeInTheDocument();
      },
      { timeout: 5000 },
    );

    unmount();
  });
  it('should read empty records', () => {
    const { getByTestId, unmount } = render(<TablesReadView rowsTested={[]} />);

    unmount();
  });

  it('should click in a row', async () => {
    const user = userEvent.setup();
    // Creating a record
    const createRes: AxiosResponse<TableCreateRes | undefined> = await post(
      {
        name: 'Table 1',
        cols: [
          {
            filter: true,
            headerName: 'headerName',
            field: 'field',
            name: 'nam2e',
            id: 'id1',
            sortable: true,
            kind: 'selectbox',
          },
          {
            filter: true,
            headerName: 'headerName',
            field: 'field',
            name: 'name',
            id: 'id',
            sortable: true,
            kind: 'text',
          },
        ],
      },
      'table/create',
    );

    const { getByTestId, unmount } = render(<TablesReadView />);

    await waitFor(async () => {
      const row = document.querySelector(
        '.ag-cell.ag-cell-not-inline-editing.ag-cell-normal-height.ag-cell-value',
      );

      expect(row).toBeInTheDocument();

      row && user.click(row);
    });

    unmount();
  });
  it('should test grid panel actions', async () => {
    const user = userEvent.setup();
    const { getByTestId, unmount } = render(<TablesReadView />);

    await waitFor(async () => {
      const addBtn = getByTestId('read-tables-aggrid-panel-add-btn');

      expect(addBtn).toBeInTheDocument();

      await user.click(addBtn);
    });

    await waitFor(async () => {
      const refreshBtn = getByTestId('read-tables-aggrid-panel-refresh-btn');

      expect(refreshBtn).toBeInTheDocument();

      await user.click(refreshBtn);
    });

    await waitFor(async () => {
      const updateMode = getByTestId('read-tables-aggrid-panel-update-mode');

      expect(updateMode).toBeInTheDocument();

      await user.click(updateMode);
    });

    await waitFor(async () => {
      const updateBtn = getByTestId('read-tables-aggrid-update-row-btn');

      await user.click(updateBtn);
    });

    unmount();
  });
  it('should update a record', async () => {
    const user = userEvent.setup();

    // Creating a record
    const tableBody = {
      name: 'Table 1',
      cols: [
        {
          filter: true,
          headerName: 'headerName',
          field: 'field',
          name: 'name',
          id: 'id1',
          sortable: true,
          kind: TableColumnRef.KindEnum.Selectbox,
        },
      ],
    };

    const createRes: AxiosResponse<TableCreateRes> = await post(
      tableBody,
      'table/create',
    );

    expect(createRes.status).toBe(200);

    const id = createRes.data.id;

    // mounting component and passing table id as prop
    const { unmount, getByTestId, getAllByTestId, container } = render(
      <UpdateTableView tableId={id} />,
    );

    // Selecting input to update table's name and typing in it
    const tableNameInput: HTMLInputElement | null = document.querySelector(
      '.update-table__name-input',
    );

    expect(tableNameInput).toBeInTheDocument();

    const newName = 'Table Updated';

    if (tableNameInput) {
      await user.clear(tableNameInput);
      await user.type(tableNameInput, newName);
    }

    await waitFor(
      async () => {
        const updateTableView = screen.getByTestId('update-view');
        expect(updateTableView).toBeInTheDocument();

        // Selecting column component in the GUI and filling fields

        const col1 = screen.getByTestId('update-view-col-0');
        expect(col1).toBeInTheDocument();
      },
      { timeout: 10000 },
    );

    const col1NameInput = screen.getByTestId(
      'update-view-col-0-input',
    ) as HTMLInputElement;

    expect(col1NameInput).toBeInTheDocument();

    expect(col1NameInput?.value).toBe('headerName');

    await user.clear(col1NameInput);
    const newColName = 'Col updated';

    await user.type(col1NameInput, newColName);

    await waitFor(
      async () => {
        expect(col1NameInput?.value).toBe(newColName);
      },
      { timeout: 100000 },
    );

    const col1KindDropdown = screen.getByTestId('update-view-col-0-dropdown');

    expect(col1KindDropdown).toBeInTheDocument();

    await user.selectOptions(col1KindDropdown, 'checkboxes');

    const filterBtnChecked = document.querySelector(
      '.table-row__filter-icon--checked',
    );

    const filterBtnUnchecked = document.querySelector(
      '.table-row__filter-icon--unchecked',
    );

    expect(filterBtnChecked || filterBtnUnchecked).toBeInTheDocument();

    if (filterBtnChecked) {
      expect(filterBtnChecked).toBeInTheDocument();

      await user.click(filterBtnChecked);

      expect(
        document.querySelector('.table-row__filter-icon--unchecked'),
      ).toBeInTheDocument();
    }

    if (filterBtnUnchecked) {
      expect(filterBtnUnchecked).toBeInTheDocument();

      await user.click(filterBtnUnchecked);
      expect(
        document.querySelector('.table-row__filter-icon--checked'),
      ).toBeInTheDocument();
    }

    const sortBtnChecked = document.querySelector(
      '.table-row__sort-icon--checked',
    );

    const sortBtnUnchecked = document.querySelector(
      '.table-row__sort-icon--unchecked',
    );

    expect(sortBtnChecked || sortBtnUnchecked).toBeInTheDocument();
    if (sortBtnChecked) {
      expect(sortBtnChecked).toBeInTheDocument();

      await user.click(sortBtnChecked);
    }

    if (sortBtnUnchecked) {
      expect(sortBtnUnchecked).toBeInTheDocument();

      await user.click(sortBtnUnchecked);
    }

    expect(tableNameInput?.value).toBe(newName);

    // Selecting update button to send the new data to server

    const updateBtn = screen.getByTestId('update-view-update-btn');

    await user.click(updateBtn);

    // Checking if table parameters were properly changed
    await waitFor(
      async () => {
        const readRes: AxiosResponse<TableReadRes | undefined> = await post(
          { id: createRes.data.id },
          'table/read',
        );

        const bodyUpdated: TableReadRes = {
          name: newName,
          id: createRes.data.id,
          cols: [
            {
              filter: !tableBody.cols[0].filter,
              sortable: !tableBody.cols[0].sortable,
              kind: TableColumnRef.KindEnum.Checkboxes,
              id: tableBody.cols[0].id,
              name: newColName,
              headerName: newColName,
              field: newColName,
            },
          ],
        };

        expect(readRes.data?.name).toBe(bodyUpdated.name);
        expect(readRes.data?.id).toBe(bodyUpdated.id);
        expect(readRes.data?.cols?.[0].name).toBe(bodyUpdated?.cols?.[0].name);
        expect(readRes.data?.cols?.[0].field).toBe(
          bodyUpdated?.cols?.[0].field,
        );
        expect(readRes.data?.cols?.[0].sortable).toBe(
          bodyUpdated?.cols?.[0].sortable,
        );
        expect(readRes.data?.cols?.[0].filter).toBe(
          bodyUpdated?.cols?.[0].filter,
        );
        expect(readRes.data?.cols?.[0].headerName).toBe(
          bodyUpdated?.cols?.[0].headerName,
        );
        expect(readRes.data?.cols?.[0].kind).toBe(bodyUpdated?.cols?.[0].kind);
        expect(readRes.data?.cols?.[0].id).toBe(bodyUpdated?.cols?.[0].id);
      },
      {
        timeout: 30000,
      },
    );

    // Just testing the go-to tables btn.
    const navigateToTablesBtn = document.querySelector(
      '.update-table__tables-read-btn',
    );

    navigateToTablesBtn && (await user.click(navigateToTablesBtn));

    expect(navigateToTablesBtn).toBeInTheDocument();
    unmount();
  });

  it('should create a new table, read and delete it', async () => {
    const user = userEvent.setup();

    const createTable = render(<CreateTableView testId="create-table" />);
    const unmountCreateTable = createTable.unmount;

    const input = screen.getByTestId('create-table-input');
    const createBtn = screen.getByTestId('table-view-create-btn');

    expect(createBtn).toBeInTheDocument();
    expect(input).toBeInTheDocument();

    // Adding a new column

    const addColBtn = screen.getByTestId('table-view-add-col-btn');

    await user.click(addColBtn);

    const inputVal = 'Table 1';

    // Creating the table

    await user.type(input, inputVal);
    await user.click(createBtn);

    // Checking if it matches in the database

    const res: AxiosResponse<TablesReadRes> = await post(
      {
        from: 1,
        to: 11,
        filters: {},
      },
      'tables/read',
    );

    expect(
      res.data.tables?.some((table) => table.name === inputVal),
    ).toBeTruthy();

    unmountCreateTable();

    const { container, unmount, getByTestId, getAllByTestId } = render(
      <MemoryRouter initialEntries={['/tables/read']}>
        <Routes>
          <Route path="/tables/read" element={<TablesReadView />} />
          <Route path="/table/update" element={<UpdateTableView />} />
        </Routes>
      </MemoryRouter>,
      // <TablesReadView />,
    );

    // Checking if components are correctly loaded
    await waitFor(async () => {
      expect(getByTestId('read-tables-aggrid')).toBeInTheDocument();
      const inputVal = 'Table';

      const agGridCells = Array.from(
        document.querySelectorAll(
          '.ag-cell.ag-cell-not-inline-editing.ag-cell-normal-height.ag-cell-value',
        ),
      ) as HTMLDivElement[];

      expect(
        agGridCells.some((cell) => cell.innerText.includes(inputVal)),
      ).toBeTruthy();

      const deleteModeBtn = getByTestId('read-tables-aggrid-panel-delete-mode');

      expect(deleteModeBtn).toBeInTheDocument();

      const updateModeBtn = getByTestId('read-tables-aggrid-panel-update-mode');

      expect(updateModeBtn).toBeInTheDocument();

      // expect(agGridRows.every((row) => !!row)).toBe(true);
    });

    /////////////////////////////////////////////////////
    // UPDATING ROWS

    // const updateModeBtn = getByTestId('read-tables-aggrid-panel-update-mode');

    // await fireEvent.click(updateModeBtn);

    // const updateBtns = getAllByTestId('read-tables-aggrid-update-row-btn');

    // expect(updateBtns[0]).toBeTruthy();

    // await fireEvent.click(updateBtns[0]);

    // await waitFor(() => {
    //   expect(document.querySelector('.update-table__name-input')).toBeTruthy();
    // });

    //////////////////////////////////////////////////////
    // DELETING ROWS

    // Entering Delete Mode

    const deleteModeBtn = getByTestId('read-tables-aggrid-panel-delete-mode');

    await user.click(deleteModeBtn);

    // Selecting rows in the GUI

    const agGridRows = Array.from(
      document.querySelectorAll(
        '.ag-row.ag-row-level-0.ag-row-position-absolute.ag-row-not-inline-editing',
      ),
    ) as HTMLDivElement[];

    expect(agGridRows[0]).toBeInTheDocument();

    agGridRows.forEach(async (row) => {
      await waitFor(
        async () => {
          const cell = row.querySelector(
            '.ag-cell.ag-cell-not-inline-editing.ag-cell-normal-height.ag-cell-value',
          ) as HTMLDivElement;
          let rowInput;

          if (cell.innerText.includes('Table')) {
            rowInput = row.querySelector(
              '.ag-input-field-input.ag-checkbox-input',
            ) as HTMLInputElement;
            expect(rowInput).toBeInTheDocument();

            expect(rowInput.checked).toBe(false);
            await user.click(rowInput);
            expect(rowInput.checked).toBe(true);
          }
        },
        { timeout: 6000 },
      );
    });

    // Clicking in the delete button and waiting for the db response

    const deleteBtn = getByTestId('read-tables-aggrid-panel-delete-btn');

    expect(deleteBtn).toBeInTheDocument();

    await waitFor(
      async () => {
        await user.click(deleteBtn);

        const tablesRes: AxiosResponse<TablesReadRes | undefined> = await post(
          {
            from: 1,
            to: 20,
            filters: {},
          },
          'tables/read',
        );

        expect(tablesRes.status).toBe(404);
      },
      { timeout: 10000 },
    );
  });
});
