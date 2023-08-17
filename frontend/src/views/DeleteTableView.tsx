import { useEffect, useState } from 'react';
import { Table } from '../pontus-api/typescript-fetch-client-generated';
import { deleteTable, getTables } from '../client';
import { useTranslation } from 'react-i18next';
import { capitalizeFirstLetter } from '../webinyApi';

const DeleteTableView = () => {
  const [table, setTable] = useState<Table>();
  const [tables, setTables] = useState<Table[]>();
  const [successMessage, setSuccessMessage] = useState('');
  const { t } = useTranslation();

  const fetchTables = async () => {
    const data = await getTables();

    setTables(data.tables);
  };
  const tableDelete = async () => {
    if (!table || !table.tableId) return;
    console.log('delete');
    const res = await deleteTable(table?.tableId);

    if (res?.statusText === 'OK') {
      setSuccessMessage(
        `${t('table')} ${table?.name} ${t('created-successfully')}.`,
      );
    }
  };
  useEffect(() => {
    fetchTables();
  }, []);

  return (
    <>
      <select
        name=""
        id=""
        onChange={(e) => {
          setTable(JSON.parse(e.target.value));
        }}
      >
        <option value=""></option>
        {tables?.map((table) => (
          <option value={JSON.stringify(table)}>{table.name}</option>
        ))}
      </select>
      <button onClick={() => tableDelete()}>Delete</button>
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
    </>
  );
};

export default DeleteTableView;
