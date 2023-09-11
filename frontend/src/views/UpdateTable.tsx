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

const updateTableView = () => {
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
    <div className="flex flex-col items-center h-full pt-12">
      {cols.length > 0 && (
        <div className="overflow-x-auto w-5/6">
          <div className="w-full">
            <div className="bg-white shadow-md rounded my-6">
              <table className="min-w-max w-full table-auto">
                <thead>
                  <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left">{t('col')}</th>
                    <th className="py-3 px-6 text-left">{t('col-type')}</th>
                    <th className="py-3 px-6 text-center">{t('filter')}</th>
                    <th className="py-3 px-6 text-center">{t('sortable')}</th>
                    <th className="py-3 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
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
        >
          {t('Update')}
        </button>
      )}
      {successMessage && (
        <div
          className="flex items-center p-4 mb-4 text-sm text-green-800 border border-green-300 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800"
          role="alert"
        >
          <svg
            className="flex-shrink-0 inline w-4 h-4 mr-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <span className="sr-only">Info</span>
          <div>
            <span className="font-medium">Success alert!</span>{' '}
            {capitalizeFirstLetter(successMessage)}
          </div>
        </div>
      )}
    </div>
  );
};

export default updateTableView;
