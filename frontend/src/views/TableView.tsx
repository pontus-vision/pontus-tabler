import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import {
  TableColumnCrud,
  TableColumnRef,
  TableRef,
} from '../typescript/api';
import { useTranslation } from 'react-i18next';
import NewTableCol from '../components/NewTable/ColumnDef';

type Props = {
  onUpdate?: (data: TableColumnRef[], tableColsCrud: TableColumnCrud) => void;
  onCreate?: (data: TableColumnRef[]) => void;
  table?: TableRef;
  testId?: string;
  onColsCreation?: (data: TableColumnRef[]) => void;
  onInputChange?: (
    e: ChangeEvent<HTMLInputElement>,
    field: string,
    setValidationError: Dispatch<SetStateAction<Record<string, any>>>,
  ) => void;
  validationError: Record<string, any>;
  setValidationError: Dispatch<SetStateAction<Record<string, any>>>;
};

const TableView = ({
  onCreate,
  onUpdate,
  table,
  testId,
  onColsCreation,
  onInputChange,
  validationError,
  setValidationError,
}: Props) => {
  let [cols, setCols] = useState<TableColumnRef[]>([]);
  const { t, i18n } = useTranslation();
  const [renameCols, setRenameCols] = useState<Record<string, string>>()
  const [addCols, setAddCols] = useState<Record<string, Record<string, string>>>()
  const [deleteCols, setDeleteCols] = useState<string[]>([])

  useEffect(() => {
    const name = cols.length > 0 ? cols[0]?.name : '';
  }, [cols]);


  useEffect(() => {
    // table && setNewTable(table);
    if (cols.length === 0) {
      table?.cols && setCols(table?.cols);
    }
  }, [table]);

  useEffect(() => {
    console.log({ renameCols })
  }, [renameCols]);

  useEffect(() => {
    console.log({ addCols })
  }, [addCols]);

  useEffect(() => {
    console.log({ deleteCols })
  }, [deleteCols]);

  return (
    <div className="update-table" data-testid={testId} >
      {
        <div className="update-table-overflow-container">
          <div className="update-table-container">
            <div className="update-table-card">
              <table className="update-table-table">
                <thead>
                  <tr className="update-table-table-header">
                    <th className="update-table-table-header-cell">
                      {t('col')}
                    </th>
                    <th className="update-table-table-header-cell">
                      {t('col-type')}
                    </th>
                    <th className="update-table-table-header-cell center">
                      {t('filter')}
                    </th>
                    <th className="update-table-table-header-cell center">
                      {t('sortable')}
                    </th>
                    <th className="update-table-table-header-cell center">Order</th>
                    <th className="update-table-table-header-cell center">Description</th>
                    <th className="update-table-table-header-cell center">Actions</th>
                  </tr>
                </thead>
                <tbody className="update-table-table-body">
                  {cols &&
                    cols.map((col, index) => (
                      <>
                        <NewTableCol
                          setValidationError={setValidationError}
                          onInputChange={onInputChange}
                          setRenameCols={setRenameCols}
                          setDeleteCols={setDeleteCols}
                          setAddCols={setAddCols}
                          onCreate={onUpdate}
                          validationError={validationError}
                          key={index}
                          colsLength={cols.length}
                          colDef={col}
                          setCols={setCols}
                          index={index}
                          testId={`${testId}-col-${index}`}
                        /></>
                    ))}
                </tbody>
              </table>
              <button
                type="button"
                data-testid={`${testId}-add-col-btn`}
                data-cy="grid-add-btn"
                onClick={() =>
                  setCols((prevState) => {
                    return [
                      ...prevState,
                      {
                        field: '',
                        filter: false,
                        headerName: '',
                        name: '',
                        sortable: false,
                        newCol: true
                      },
                    ];
                  })
                }
                className="update-table-add-button"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      }

      {cols && onUpdate && (
        <button
          type="button"
          onClick={() => {
            const colsReq = cols.map(col => {
              const { pivotIndex, originalIndex, ...rest } = col
              return { ...rest, pivotIndex: (pivotIndex as number) }
            })

            const addColumns = {}
            for (const prop in addCols) {
              for (const prop2 in addCols[prop]) {
                addColumns[prop2] = addCols[prop][prop2]
              }
            }

            cols && onUpdate(colsReq, { tableName: table?.name, addColumns, renameColumns: renameCols, dropColumns: deleteCols });
          }}
          className="update-table-update-button"
          data-testid={`${testId}-update-btn`}
        >
          {t('Update')}
        </button>
      )}

      {cols && onCreate && (
        <button
          type="submit"
          data-testid={`${testId}-create-btn`}
          data-cy={`create-table-btn`}
          onClick={() => {
            const colsReq = cols.map(col => {
              const { pivotIndex, originalIndex, ...rest } = col
              return { ...rest, pivotIndex: (pivotIndex as number) }
            })
            console.log({ colsReq })
            onCreate && cols && onCreate(colsReq);
          }}
          className="update-table-update-button"
        >
          {t('Create')}
        </button>
      )}
    </div>
  );
};

export default TableView;
