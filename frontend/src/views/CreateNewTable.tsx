import { useTranslation } from 'react-i18next';
import NewTableCol from '../components/NewTable/Column';
import { useEffect, useState } from 'react';
import { NewTableColumn } from '../pontus-api/typescript-fetch-client-generated';
import { createTable } from '../client';
import { capitalizeFirstLetter } from '../webinyApi';

const CreateNewTable = () => {
  const { t, i18n } = useTranslation();
  const [name, setName] = useState<string>('');

  const [cols, setCols] = useState<{ colId: string; colDef: NewTableColumn }[]>(
    [
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
    ],
  );
  const [successMessage, setSuccessMessage] = useState('');

  function generateUniqueId() {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 10000); // You can adjust the range as needed
    return `${timestamp}-${random}`;
  }

  const create = async () => {
    const res = await createTable({
      name,
      cols: cols.map((col) => col.colDef),
    });

    if (res?.statusText === 'OK') {
      setSuccessMessage(`${t('table')} ${name} ${t('created-successfully')}.`);
    }
  };

  useEffect(() => {
    console.log({ cols });
  }, [cols]);

  return (
    <div className="flex flex-col px-20 items-center">
      <label htmlFor="">{t('table-name')}</label>
      <input
        onChange={(e) => setName(e.target.value)}
        type="text"
        id="default-input"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
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
      <button
        onClick={() => create()}
        className="group relative h-12 w-48 overflow-hidden rounded-2xl bg-green-500 text-lg font-bold text-white"
      >
        Create
        <div className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
      </button>
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

export default CreateNewTable;
