import { useEffect, useState } from 'react';
import NewTableCol from '../components/NewTable/Column';
import {
  GetTablesResponse,
  NewTableColumn,
  Table,
  TableColumn,
} from '../pontus-api/typescript-fetch-client-generated';
import { getTable, getTables, updateTable } from '../client';
import { useTranslation } from 'react-i18next';
import { capitalizeFirstLetter } from '../webinyApi';
import { useLocation, useParams } from 'react-router-dom';

const UpdateTableView = () => {
  const [cols, setCols] = useState<{ colId: string; colDef: NewTableColumn }[]>(
    [],
  );
  const [table, setTable] = useState<Table>();
  const [tables, setTables] = useState<Table[]>();
  const [successMessage, setSuccessMessage] = useState('');
  const params = useParams();

  function generateUniqueId() {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 10000); // You can adjust the range as needed
    return `${timestamp}-${random}`;
  }
  const { t, i18n } = useTranslation();

  const fetchTable = async (id: string) => {
    const data = await getTable(id);
    setTable(data?.data);

    data?.data.cols &&
      setCols(
        data?.data.cols?.map((col) => {
          return {
            colId: col.id || '',
            colDef: col,
          };
        }),
      );
  };

  useEffect(() => {
    if (!params.id) return;
    fetchTable(params.id);
  }, [params]);

  const update = async () => {
    const res = await updateTable({
      tableId: table?.tableId,
      cols: cols.map((col) => col.colDef),
    });

    if (res?.statusText === 'OK') {
      setSuccessMessage(
        `${t('table')} ${table?.name} ${t('created-successfully')}.`,
      );
    }
  };

  return (
    <div className="update-table">
      {cols.length > 0 && (
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
                  {cols.map((col, index) => (
                    <NewTableCol
                      key={col.colId}
                      colDef={col.colDef}
                      setCols={setCols}
                      index={index}
                    />
                  ))}
                </tbody>
              </table>
              <button
                onClick={() =>
                  setCols((prevState) => [
                    ...prevState,
                    {
                      colId: generateUniqueId(),
                      colDef: {
                        field: '',
                        filter: false,
                        headerName: '',
                        name: '',
                        sortable: false,
                        tableId: '',
                      },
                    },
                  ])
                }
                className="update-table-add-button"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {table && (
        <button
          onClick={() => {
            update();
          }}
          className="update-table-update-button"
        >
          {t('Update')}
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

export default UpdateTableView;
