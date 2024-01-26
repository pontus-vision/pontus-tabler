import { useEffect, useState } from 'react';
import NewTableCol from '../../components/NewTable/ColumnDef';

import { tableRead, getTables, updateTable } from '../../client';
import { useTranslation } from 'react-i18next';
import { capitalizeFirstLetter } from '../../webinyApi';
import { useLocation, useParams } from 'react-router-dom';
import {
  TableColumnRef,
  TableRef,
  TableUpdateReq,
} from '../../pontus-api/typescript-fetch-client-generated';
import TableView from '../TableView';
import PVGridWebiny2 from '../../pv-react/PVGridWebiny2';

const ReadTableView = () => {
  const [cols, setCols] = useState<TableColumnRef[]>([]);
  const [table, setTable] = useState<TableRef>();
  const [tables, setTables] = useState<TableRef[]>();
  const [name, setName] = useState<string>();

  const params = useParams();

  const { t, i18n } = useTranslation();

  const fetchTable = async (id: string) => {
    console.log({ id });
    // const data = await tableRead({ id });
    // setTable(data?.data);
    // console.log({ data });

    // data?.data.cols && setCols(data?.data.cols);
  };

  useEffect(() => {
    if (!params.id) return;
    console.log({ id: params.id });
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
      <PVGridWebiny2 cols={cols} />
    </>
  );
};

export default ReadTableView;
