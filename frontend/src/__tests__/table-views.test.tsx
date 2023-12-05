import {
  fireEvent,
  getByText,
  render,
  screen,
  waitFor,
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

describe('TableViews', () => {
  it('should load components properly', async () => {
    const { unmount } = render(<CreateTableView />);

    // const button = getByText('Create')
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
    const { unmount, getByTestId, getByRole, container } = render(
      <NewTableCol testId="column-data" index={1} />,
    );

    const filterBtnUnchecked = document.querySelector(
      '.table-row__filter-icon--unchecked',
    );

    filterBtnUnchecked && (await fireEvent.click(filterBtnUnchecked));

    await waitFor(() => {
      const filterBtnChecked = document.querySelector(
        '.table-row__filter-icon--checked',
      );

      expect(filterBtnChecked).toBeTruthy();
    });

    const sortBtnUnchecked = document.querySelector(
      '.table-row__sort-icon--unchecked',
    );

    sortBtnUnchecked && (await fireEvent.click(sortBtnUnchecked));

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

    fireEvent.change(dropdownSelect, { target: { value: 'selectbox' } });
    expect(dropdownSelect.value).toBe('selectbox');

    fireEvent.change(dropdownSelect, { target: { value: 'text' } });
    expect(dropdownSelect.value).toBe('text');

    fireEvent.change(dropdownSelect, { target: { value: 'email' } });
    expect(dropdownSelect.value).toBe('email');

    fireEvent.change(dropdownSelect, { target: { value: 'zipcode' } });
    expect(dropdownSelect.value).toBe('zipcode');

    fireEvent.change(dropdownSelect, { target: { value: 'selectbox' } });
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
    const { getByTestId, container } = render(<App />, {
      wrapper: BrowserRouter,
    });

    await waitFor(
      () => {
        expect(getByTestId('header-logo')).toBeInTheDocument();
      },
      { timeout: 5000 },
    );

    console.log({ container: container.innerHTML });
  });
  it('should read empty records', () => {
    const { getByTestId, unmount } = render(<TablesReadView rowsTested={[]} />);
    unmount();
  });
  it('should test grid panel actions', async () => {
    //Deleting records

    const tablesRes: AxiosResponse<TablesReadRes> = await post(
      {
        from: 1,
        to: 20,
        filters: {},
      },
      'tables/read',
    );

    tablesRes?.data?.tables?.forEach(async (table) => {
      const deleteRes = await post({ id: table.id }, 'table/delete');

      expect(deleteRes).toBeTruthy();
    });

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
      const addBtn = getByTestId('read-tables-aggrid-panel-add-btn');

      expect(addBtn).toBeInTheDocument();

      fireEvent.click(addBtn);
    });

    await waitFor(async () => {
      const row = document.querySelector(
        '.ag-cell.ag-cell-not-inline-editing.ag-cell-normal-height.ag-cell-value',
      );

      expect(row).toBeInTheDocument();

      row && fireEvent.click(row);
    });

    await waitFor(async () => {
      const refreshBtn = getByTestId('read-tables-aggrid-panel-refresh-btn');

      expect(refreshBtn).toBeInTheDocument();

      fireEvent.click(refreshBtn);
    });

    await waitFor(() => {
      const updateMode = getByTestId('read-tables-aggrid-panel-update-mode');

      expect(updateMode).toBeInTheDocument();

      fireEvent.click(updateMode);
    });

    await waitFor(() => {
      const updateBtn = getByTestId('read-tables-aggrid-update-row-btn');

      fireEvent.click(updateBtn);
    });

    const readRes: AxiosResponse<TablesReadRes> = await post(
      {
        from: 1,
        to: 11,
        filters: {},
      },
      'tables/read',
    );

    expect(readRes.data.totalTables).toBe(1);
    const deleteRes = await post({ id: createRes?.data?.id }, 'table/delete');

    expect(deleteRes.status).toBe(200);

    unmount();
  });
  it('should update a record', async () => {
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
        {
          filter: true,
          headerName: 'headerName',
          field: 'field',
          name: 'name',
          id: 'id',
          sortable: true,
          kind: TableColumnRef.KindEnum.Text,
        },
      ],
    };

    const createRes: AxiosResponse<TableCreateRes> = await post(
      tableBody,
      'table/create',
    );

    expect(createRes.status).toBe(200);

    const id = createRes.data.id;

    const { unmount, getByTestId, getAllByTestId, container } = render(
      <UpdateTableView tableId={id} />,
    );

    const updateTableInput: HTMLInputElement | null = document.querySelector(
      '.update-table__name-input',
    );

    expect(updateTableInput).toBeInTheDocument();

    if (updateTableInput) {
      const newName = 'Table Updated';

      await userEvent.type(updateTableInput, newName);
    }
    expect(updateTableInput?.value).toBe('Table Updated');

    const updateTableView = getByTestId('update-view');

    expect(updateTableView).toBeInTheDocument();

    await waitFor(
      async () => {
        const col1 = getByTestId('update-view-col-0');

        expect(col1).toBeInTheDocument();
      },
      { timeout: 6000 },
    );

    const col1NameInput = getByTestId(
      'update-view-col-0-input',
    ) as HTMLInputElement;

    expect(col1NameInput).toBeInTheDocument();

    fireEvent.change(col1NameInput, { target: { value: 'Col updated' } });

    expect(col1NameInput?.value).toBe('Col updated');

    const col1KindDropdown = getByTestId('update-view-col-0-dropdown');

    expect(col1KindDropdown).toBeInTheDocument();

    fireEvent.change(col1KindDropdown, { target: { value: 'checkboxes' } });

    const filterBtnChecked = document.querySelector(
      '.table-row__filter-icon--checked',
    );

    const filterBtnUnchecked = document.querySelector(
      '.table-row__filter-icon--unchecked',
    );

    if (filterBtnChecked) {
      expect(filterBtnChecked).toBeInTheDocument();

      fireEvent.click(filterBtnChecked);
    }

    if (filterBtnUnchecked) {
      expect(filterBtnUnchecked).toBeInTheDocument();

      fireEvent.click(filterBtnUnchecked);
    }

    const sortBtnChecked = document.querySelector(
      '.table-row__sort-icon--checked',
    );

    const sortBtnUnchecked = document.querySelector(
      '.table-row__sort-icon--unchecked',
    );

    if (sortBtnChecked) {
      expect(sortBtnChecked).toBeInTheDocument();

      fireEvent.click(sortBtnChecked);
    }

    if (sortBtnUnchecked) {
      expect(sortBtnUnchecked).toBeInTheDocument();

      fireEvent.click(sortBtnUnchecked);
    }

    expect(updateTableInput?.value).toBe('Table Updated');

    const updateBtn = getByTestId('update-view-update-btn');

    await waitFor(() => {
      fireEvent.click(updateBtn);
    });

    const readRes: AxiosResponse<TableReadRes | undefined> = await post(
      { id: createRes.data.id },
      'table/read',
    );

    const bodyUpdated: TableReadRes = {
      name: 'Table Updated',
      id: createRes.data.id,
      cols: [
        {
          filter: !tableBody.cols[0].filter,
          sortable: !tableBody.cols[0].sortable,
          kind: TableColumnRef.KindEnum.Checkboxes,
          id: tableBody.cols[0].id,
          name: 'Col updated',
          headerName: 'Col updated',
          field: 'Col updated',
        },
        {
          filter: true,
          sortable: true,
          kind: TableColumnRef.KindEnum.Text,
          id: 'id',
          name: 'headerName',
          headerName: 'headerName',
          field: 'headerName',
        },
      ],
    };

    expect(readRes.data?.name).toBe(bodyUpdated.name);
    expect(readRes.data?.id).toBe(bodyUpdated.id);
    expect(readRes.data?.cols?.[0].name).toBe(bodyUpdated?.cols?.[0].name);
    expect(readRes.data?.cols?.[0].field).toBe(bodyUpdated?.cols?.[0].field);
    expect(readRes.data?.cols?.[0].sortable).toBe(
      bodyUpdated?.cols?.[0].sortable,
    );
    expect(readRes.data?.cols?.[0].filter).toBe(bodyUpdated?.cols?.[0].filter);
    expect(readRes.data?.cols?.[0].headerName).toBe(
      bodyUpdated?.cols?.[0].headerName,
    );
    expect(readRes.data?.cols?.[0].kind).toBe(bodyUpdated?.cols?.[0].kind);
    expect(readRes.data?.cols?.[0].id).toBe(bodyUpdated?.cols?.[0].id);

    const navigateToTablesBtn = document.querySelector(
      '.update-table__tables-read-btn',
    );

    navigateToTablesBtn && (await fireEvent.click(navigateToTablesBtn));
  });

  it('should create a new table, read and delete it', async () => {
    const {
      unmount: unmountCreateTable,
      container: createTableContainer,
      getByTestId: getByTestIdCreateTable,
      getAllByTestId: getAllByTestIdCreateTable,
    } = render(<CreateTableView testId="create-table" />);

    const input = getByTestIdCreateTable('create-table-input');
    const createBtn = getByTestIdCreateTable('table-view-create-btn');

    expect(createBtn).toBeInTheDocument();
    expect(input).toBeInTheDocument();

    // Adding a new column

    const addColBtn = getByTestIdCreateTable('table-view-add-col-btn');

    fireEvent.click(addColBtn);

    const inputVal = 'Table 1';

    // Creating the table

    await userEvent.type(input, inputVal);
    fireEvent.click(createBtn);

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

    const agGridRows = Array.from(
      document.querySelectorAll(
        '.ag-row.ag-row-level-0.ag-row-position-absolute.ag-row-not-inline-editing',
      ),
    ) as HTMLDivElement[];

    expect(agGridRows[0]).toBeInTheDocument();

    const deleteModeBtn = getByTestId('read-tables-aggrid-panel-delete-mode');

    fireEvent.click(deleteModeBtn);

    const user = userEvent.setup();

    agGridRows.forEach(async (row) => {
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
        fireEvent.click(rowInput);
        expect(rowInput.checked).toBe(true);
      }
    });

    const deleteBtn = getByTestId('read-tables-aggrid-panel-delete-btn');

    expect(deleteBtn).toBeInTheDocument();

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
  });
});
