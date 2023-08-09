import { useEffect, useState } from 'react';
import NewTableCol from '../components/NewTable/Column';
import {
  GetTablesResponse,
  NewTableColumn,
  Table,
  TableColumn,
} from '../pontus-api/typescript-fetch-client-generated';
import { getTables } from '../client';
import { useTranslation } from 'react-i18next';

const updateTable = () => {
  const [cols, setCols] = useState<{ colId: string; colDef: NewTableColumn }[]>(
    [],
  );
  const [tableId, setTableId] = useState<string>();
  const [tables, setTables] = useState<Table[]>();
  function generateUniqueId() {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 10000); // You can adjust the range as needed
    return `${timestamp}-${random}`;
  }
  const { t, i18n } = useTranslation();

  const fetchTables = async () => {
    const data = await getTables();
    console.log(data);
    setTables(data.tables);
  };

  useEffect(() => {
    fetchTables();
  }, []);

  useEffect(() => {
    console.log({ cols });
  }, [cols]);
  return (
    <div className="flex flex-col items-center">
      <select
        name=""
        id=""
        onChange={(e) => {
          setCols(
            JSON.parse(e.target.value).cols.map((col: TableColumn) => {
              return { colId: generateUniqueId(), colDef: col };
            }),
          );
          setTableId(JSON.parse(e.target.value).tableId);
        }}
      >
        <option value=""></option>
        {tables?.map((table) => (
          <option value={JSON.stringify(table)}>{table.name}</option>
        ))}
      </select>
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
    </div>
  );
};

export default updateTable;
