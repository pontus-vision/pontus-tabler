import { useTranslation } from 'react-i18next';
import NewTableCol from '../components/NewTable/Column';
import { useEffect, useState } from 'react';
import { TableColumn } from '../pontus-api/typescript-fetch-client-generated';
import { createTable } from '../client';
import { capitalizeFirstLetter } from '../webinyApi';

const CreateNewTable = () => {
  const { t, i18n } = useTranslation();
  const [name, setName] = useState<string>('');

  const [cols, setCols] = useState<{ colId: string; colDef: TableColumn }[]>([
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
  ]);
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
    <div className="create-new-table">
      <label htmlFor="">{t('table-name')}</label>
      <input
        onChange={(e) => setName(e.target.value)}
        type="text"
        id="default-input"
        className="create-new-table-input"
      />
      <div className="create-new-table-overflow-container">
        <div className="create-new-table-table-container">
          <div className="create-new-table-table">
            <table className="create-new-table-table">
              <thead>
                <tr className="create-new-table-table-header">
                  <th className="create-new-table-table-header-cell">
                    {t('col')}
                  </th>
                  <th className="create-new-table-table-header-cell">
                    {t('col-type')}
                  </th>
                  <th className="create-new-table-table-header-cell">
                    {t('filter')}
                  </th>
                  <th className="create-new-table-table-header-cell">
                    {t('sortable')}
                  </th>
                  <th className="create-new-table-table-header-cell">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="create-new-table-table-body">
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
              className="create-new-table-add-button"
            >
              Add
            </button>
          </div>
        </div>
      </div>
      <button
        onClick={() => create()}
        className="create-new-table-create-button"
      >
        Create
        <div className="create-new-table-button-overlay"></div>
      </button>
      {successMessage && (
        <div className="create-new-table-alert" role="alert">
          <svg
            className="create-new-table-alert-icon"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <span className="create-new-table-alert-title">Success alert!</span>{' '}
          {capitalizeFirstLetter(successMessage)}
        </div>
      )}
    </div>
  );
};

export default CreateNewTable;
