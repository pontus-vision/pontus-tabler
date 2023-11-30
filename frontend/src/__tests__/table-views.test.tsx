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
  it.skip('should load components properly', async () => {
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

  it.skip('should render TableView cmp in "update-mode"', async () => {
    const { unmount } = render(<TableView onCreate={() => 'something'} />);

    expect(
      document?.querySelector(
        '.update-table-update-button',
      ) as HTMLInputElement,
    ).toBeTruthy();
    unmount();
  });

  it.skip('should test if btns are behaving properly', async () => {
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
  it.skip('should delete a column', async () => {
    const { container, unmount, getByTestId } = render(
      <TableView testId="table-view" />,
    );
    const addColBtn = await getByTestId('table-view-add-col-btn');
    expect(addColBtn).toBeTruthy();

    await userEvent.click(addColBtn);

    const col = getByTestId('table-view-col-0');
    expect(col).toBeTruthy();

    const colDeleteBtn = getByTestId('table-view-col-0-delete-btn');

    expect(colDeleteBtn).toBeTruthy();
    await userEvent.click(colDeleteBtn);

    expect(col).toBeFalsy();
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
    const { getByTestId, unmount } = render(<TablesReadView />);

    await waitFor(async () => {
      const addBtn = getByTestId('read-tables-aggrid-panel-add-btn');

      expect(addBtn).toBeInTheDocument();

      await fireEvent.click(addBtn);
      const row = document.querySelector(
        '.ag-cell.ag-cell-not-inline-editing.ag-cell-normal-height.ag-cell-value',
      );

      expect(row).toBeInTheDocument();

      row && fireEvent.click(row);

      const refreshBtn = getByTestId('read-tables-aggrid-panel-refresh-btn');

      expect(refreshBtn).toBeInTheDocument();

      fireEvent.click(refreshBtn);

      const updateMode = getByTestId('read-tables-aggrid-panel-update-mode');

      expect(updateMode).toBeInTheDocument();

      fireEvent.click(updateMode);

      const updateBtn = getByTestId('read-tables-aggrid-update-row-btn');

      fireEvent.click(updateBtn);
    });

    unmount();
  });
  it('should update a record', async () => {
    const res: AxiosResponse<TablesReadRes> = await post(
      {
        from: 1,
        to: 11,
        filters: {},
      },
      'tables/read',
    );

    const rec = res?.data?.tables?.[0];
    expect(rec?.id).toBeTruthy();
    console.log({ rec });

    const { unmount, getByTestId, getAllByTestId, container } = render(
      <UpdateTableView tableId={rec?.id} />,
    );

    const updateTableInput: HTMLInputElement | null = document.querySelector(
      '.update-table__name-input',
    );

    const updateTableInput2 = getByTestId('update-table-view');

    expect(updateTableInput2).toBeInTheDocument();

    expect(updateTableInput).toBeInTheDocument();
    if (updateTableInput) {
      fireEvent.change(updateTableInput, {
        target: { value: 'Table Updated' },
      });
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

    const navigateToTablesBtn = document.querySelector(
      '.update-table__tables-read-btn',
    );

    const updateBtn = getByTestId('update-view-update-btn');

    fireEvent.click(updateBtn);

    navigateToTablesBtn && (await fireEvent.click(navigateToTablesBtn));
  });
  it('should create a new table, read and delete table', async () => {
    const {
      unmount: unmountCreateTable,
      container: createTableContainer,
      getByTestId: getByTestIdCreateTable,
      getAllByTestId: getAllByTestIdCreateTable,
    } = render(<CreateTableView testId="create-table" />);

    const input = getByTestIdCreateTable('create-table-input');
    const createBtn = getByTestIdCreateTable('table-view-create-btn');

    expect(createBtn).toBeTruthy();
    expect(input).toBeTruthy();

    const inputVal = 'Table 1';

    const inputVal2 = 'Table 2';
    const addColBtn = getByTestIdCreateTable('table-view-add-col-btn');

    fireEvent.click(addColBtn);

    await userEvent.type(input, inputVal);
    fireEvent.click(createBtn);

    // await waitFor( () => {
    const res: AxiosResponse<TablesReadRes> = await post(
      {
        from: 1,
        to: 11,
        filters: {},
      },
      'tables/read',
    );

    console.log({ res: JSON.stringify(res.data) });

    expect(
      res.data.tables?.some(
        (table) => table.name === inputVal || table.name === inputVal2,
      ),
    ).toBeTruthy();
    unmountCreateTable();
    // });

    const { container, unmount, getByTestId, getAllByTestId } = render(
      <MemoryRouter initialEntries={['/tables/read']}>
        <Routes>
          <Route path="/tables/read" element={<TablesReadView />} />
          <Route path="/table/update" element={<UpdateTableView />} />
        </Routes>
      </MemoryRouter>,
      // <TablesReadView />,
    );

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

    const deleteModeBtn = getByTestId('read-tables-aggrid-panel-delete-mode');
    fireEvent.click(deleteModeBtn);

    // await waitFor(() => {
    expect(agGridRows[0]).toBeInTheDocument();
    agGridRows.forEach(async (row) => {
      const cell = row.querySelector(
        '.ag-cell.ag-cell-not-inline-editing.ag-cell-normal-height.ag-cell-value',
      ) as HTMLDivElement;
      let rowInput;

      if (cell.innerText.includes('Table')) {
        rowInput = row.querySelector(
          '.ag-input-field-input.ag-checkbox-input',
        ) as HTMLInputElement;
        expect(rowInput).toBeTruthy();

        expect(rowInput.checked).toBe(false);
        rowInput && (await fireEvent.click(rowInput));
        expect(rowInput.checked).toBe(true);
      }
    });
    // });

    const deleteBtn = getByTestId('read-tables-aggrid-panel-delete-btn');

    await waitFor(() => {
      const inputVal = 'Table';

      const agGridCells = Array.from(
        document.querySelectorAll(
          '.ag-cell.ag-cell-not-inline-editing.ag-cell-normal-height.ag-cell-value',
        ),
      ) as HTMLDivElement[];

      expect(
        agGridCells.some((cell) => cell?.innerText?.includes(inputVal)),
      ).toBeTruthy();
    });
    expect(deleteBtn).toBeInTheDocument();
    await fireEvent.click(deleteBtn);
  });
});
