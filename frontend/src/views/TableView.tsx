import { ChangeEvent, useEffect, useState } from 'react';
import {
  TableColumnRef,
  TableRef,
} from '../pontus-api/typescript-fetch-client-generated';
import { useTranslation } from 'react-i18next';
import NewTableCol from '../components/NewTable/ColumnDef';
import { capitalizeFirstLetter } from '../webinyApi';
import { OpenApiValidationFail } from '../types';

type Props = {
  onUpdate?: (data: TableColumnRef[]) => void;
  onCreate?: (data: TableColumnRef[]) => void;
  table?: TableRef;
  testId?: string;
  onColsCreation?: (data: TableColumnRef[]) => void;
  onInputChange?: (e: ChangeEvent<HTMLInputElement>, field: string) => void;
  validationError?: Record<string, any>;
};

const TableView = ({
  onCreate,
  onUpdate,
  table,
  testId,
  onColsCreation,
  onInputChange,
  validationError,
}: Props) => {
  let [cols, setCols] = useState<TableColumnRef[]>([]);

  const { t, i18n } = useTranslation();

  useEffect(() => {
    const name = cols.length > 0 ? cols[0]?.name : '';
    console.log({ cols });
  }, [cols]);

  useEffect(() => {
    // table && setNewTable(table);
    if (cols.length === 0) {
      table?.cols && setCols(table?.cols);
    }
  }, [table]);

  useEffect(() => {
    onColsCreation && onColsCreation(cols);
  }, [cols]);

  return (
    <div className="update-table" data-testid={testId}>
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
                    <th className="update-table-table-header-cell">
                      {t('filter')}
                    </th>
                    <th className="update-table-table-header-cell">
                      {t('sortable')}
                    </th>
                    <th className="update-table-table-header-cell">Actions</th>
                  </tr>
                </thead>
                <tbody className="update-table-table-body">
                  {cols &&
                    cols.map((col, index) => (
                      <NewTableCol
                        onInputChange={onInputChange}
                        validationError={validationError}
                        key={col.id}
                        colDef={col}
                        setCols={setCols}
                        index={index}
                        testId={`${testId}-col-${index}`}
                      />
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
            cols && onUpdate({ cols: cols });
          }}
          className="update-table-update-button"
          data-testid={`${testId}-update-btn`}
        >
          {t('Update')}
        </button>
      )}

      {cols && onCreate && (
        <button
          type="button"
          data-testid={`${testId}-create-btn`}
          data-cy={`create-table-btn`}
          onClick={() => {
            onCreate && cols && onCreate(cols);
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
