import { useTranslation } from 'react-i18next';
import NewTableCol from '../components/NewTable/Column';
import { useEffect, useState } from 'react';
import { NewTableColumn } from '../pontus-api/typescript-fetch-client-generated';
import { createTable } from '../client';

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

  const deleteCol = () => {};

  function generateUniqueId() {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 10000); // You can adjust the range as needed
    return `${timestamp}-${random}`;
  }

  const create = async () => {
    const data = await createTable({
      name,
      cols: cols.map((col) => col.colDef),
    });
    console.log(data);
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
    </div>
  );
};

export default CreateNewTable;
