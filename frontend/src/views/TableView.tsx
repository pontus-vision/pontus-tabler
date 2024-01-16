import { useEffect, useState } from 'react';
import {
  TableColumnRef,
  TableRef,
} from '../pontus-api/typescript-fetch-client-generated';
import { useTranslation } from 'react-i18next';
import NewTableCol from '../components/NewTable/Column';
import { capitalizeFirstLetter } from '../webinyApi';

type Props = {
  onUpdate?: (data: TableRef) => void;
  onCreate?: (data: TableRef) => void;
  table?: TableRef;
  testId?: string;
};

const TableView = ({ onCreate, onUpdate, table, testId }: Props) => {
  const [successMessage, setSuccessMessage] = useState('');
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
                data-testid={`${testId}-add-col-btn`}
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
          onClick={() => {
            cols && onCreate(cols);
          }}
          className="update-table-update-button"
        >
          {t('Create')}
        </button>
      )}
      {successMessage && (
        <div className="update-table-alert" role="alert">
          <svg
            className="update-table-alert-icon"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <span className="update-table-alert-title">Success alert!</span>{' '}
          {capitalizeFirstLetter(successMessage)}
        </div>
      )}
    </div>
  );
};

export default TableView;
