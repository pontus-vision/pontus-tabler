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
import { userEvent } from '@testing-library/user-event';
import { sendHttpRequest } from '../http';
import {
  DashboardCreateRes,
  DashboardsReadRes,
  TablesReadRes,
} from '../pontus-api/typescript-fetch-client-generated';
import { AxiosResponse } from 'axios';
import TablesReadView from '../views/tables/ReadTables';

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
  it('should ', async () => {});
  it('should create a new table, read and delete table', async () => {
    const {
      unmount: unmountCreateTable,
      container: createTableContainer,
      getByTestId: getByTestIdCreateTable,
    } = render(<CreateTableView testId="create-table" />);

    const input = getByTestIdCreateTable('create-table-input');
    const createBtn = getByTestIdCreateTable('table-view-create-btn');

    expect(input && createBtn).toBeTruthy();

    const inputVal = 'Table 1';

    await userEvent.type(input, inputVal);

    await userEvent.click(createBtn);

    // await userEvent.type(input, inputVal);

    await userEvent.click(createBtn);

    // await waitFor(() => {
    //   userEvent.type(input, inputVal);
    //   userEvent.click(createBtn);
    // });

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
      res.data.tables?.some((table) => table.name === inputVal),
    ).toBeTruthy();
    unmountCreateTable();

    const { container, unmount, getByTestId } = render(<TablesReadView />);

    await waitFor(async () => {
      expect(getByTestId('read-tables-aggrid')).toBeInTheDocument();
      const inputVal = 'Table 1';

      const agGridCells = Array.from(
        document.querySelectorAll(
          '.ag-cell.ag-cell-not-inline-editing.ag-cell-normal-height.ag-cell-value',
        ),
      ) as HTMLDivElement[];

      expect(
        agGridCells.some((cell) => cell.innerText === inputVal),
      ).toBeTruthy();
      const deleteModeBtn = getByTestId('read-tables-aggrid-panel-delete-mode');

      expect(deleteModeBtn).toBeInTheDocument();

      // expect(agGridRows.every((row) => !!row)).toBe(true);
    });

    const agGridRows = Array.from(
      document.querySelectorAll(
        '.ag-row.ag-row-level-0.ag-row-position-absolute.ag-row-not-inline-editing',
      ),
    ) as HTMLDivElement[];

    await waitFor(() => {
      const deleteModeBtn = getByTestId('read-tables-aggrid-panel-delete-mode');

      fireEvent.click(deleteModeBtn);

      expect(agGridRows[0]).toBeInTheDocument();
    });

    agGridRows.forEach(async (row) => {
      const cell = row.querySelector(
        '.ag-cell.ag-cell-not-inline-editing.ag-cell-normal-height.ag-cell-value',
      ) as HTMLDivElement;
      let rowInput;
      if (cell.innerText === 'Table 1') {
        rowInput = row.querySelector(
          '.ag-input-field-input.ag-checkbox-input',
        ) as HTMLInputElement;
      }

      expect(rowInput).toBeTruthy();
      expect(rowInput?.checked).toBe(false);
      rowInput && (await fireEvent.click(rowInput));
      expect(rowInput?.checked).toBe(true);
    });

    const deleteBtn = getByTestId('read-tables-aggrid-panel-delete-btn');
    await waitFor(() => {
      const inputVal = 'Table 1';

      const agGridCells = Array.from(
        document.querySelectorAll(
          '.ag-cell.ag-cell-not-inline-editing.ag-cell-normal-height.ag-cell-value',
        ),
      ) as HTMLDivElement[];

      expect(
        agGridCells.some((cell) => cell.innerText === inputVal),
      ).toBeTruthy();

      console.log({ deleteBtn });
    });
    expect(deleteBtn).toBeInTheDocument();
    await fireEvent.click(deleteBtn);
  });
});
