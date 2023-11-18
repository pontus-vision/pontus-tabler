import { useEffect, useState } from 'react';
import NewTableCol from '../../components/NewTable/Column';

import { getTable, getTables, updateTable } from '../../client';
import { useTranslation } from 'react-i18next';
import { capitalizeFirstLetter } from '../../webinyApi';
import { useLocation, useParams } from 'react-router-dom';
import {
  TableColumnRef,
  TableRef,
  TableUpdateReq,
} from '../../pontus-api/typescript-fetch-client-generated';
import TableView from '../TableView';

const UpdateTableView = () => {
  const [cols, setCols] = useState<TableColumnRef[]>([]);
  const [table, setTable] = useState<TableRef>();
  const [tables, setTables] = useState<TableRef[]>();
  const [name, setName] = useState<string>();

  const params = useParams();

  const { t, i18n } = useTranslation();

  const fetchTable = async (id: string) => {
    const data = await getTable(id);
    setTable(data?.data);
    console.log({ data });

    data?.data.cols && setCols(data?.data.cols);
  };

  useEffect(() => {
    if (!params.id) return;
    fetchTable(params.id);
  }, [params]);

  useEffect(() => {
    setName(table?.name);
  }, [table]);

  const handleUpdate = async (data: TableRef) => {
    try {
      const updateRes = await updateTable({ ...data, id: params.id, name });

      console.log({ updateRes });
    } catch {}
  };

  if (!table) return;

  return (
    <>
      <input
        onChange={(e) => setName(e.target.value)}
        type="text"
        value={name}
        className="create-table__name-input"
      />
      <TableView onUpdate={handleUpdate} table={table} />
    </>
  );
};

export default UpdateTableView;
