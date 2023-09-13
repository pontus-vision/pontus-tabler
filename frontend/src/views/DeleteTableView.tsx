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
    <div className="delete-table-view">
      <select
        name=""
        id=""
        onChange={(e) => {
          setTable(JSON.parse(e.target.value));
        }}
        className="delete-table-view-select"
      >
        <option value=""></option>
        {tables?.map((table) => (
          <option value={JSON.stringify(table)}>{table.name}</option>
        ))}
      </select>
      <button
        onClick={() => tableDelete()}
        className="delete-table-view-button"
      >
        Delete
      </button>
      {successMessage && (
        <div className="delete-table-view-alert" role="alert">
          <svg
            className="delete-table-view-alert-icon"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <span className="delete-table-view-alert-title">Success alert!</span>{' '}
          {capitalizeFirstLetter(successMessage)}
        </div>
      )}
    </div>
  );
};

export default DeleteTableView;
