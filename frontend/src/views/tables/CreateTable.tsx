import { useEffect, useState } from 'react';
import { createTable, getTable } from '../../client';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router-dom';
import {
  TableColumnRef,
  TableRef,
} from '../../pontus-api/typescript-fetch-client-generated';
import TableView from '../TableView';

type Props = {
  testId?: string;
};

const CreateTableView = ({ testId }: Props) => {
  const [cols, setCols] = useState<TableColumnRef[]>([]);
  const [name, setName] = useState<string>();

  const [tables, setTables] = useState<TableRef[]>();

  const { t, i18n } = useTranslation();

  const handleCreate = async (data: TableRef) => {
    setName('');
    try {
      const createRes = await createTable({ ...data, name });
    } catch {}
  };

  return (
    <>
      <label htmlFor="">Name</label>
      <input
        data-testid={`${testId}-input`}
        onChange={(e) => setName(e.target.value)}
        value={name}
        type="text"
        className="create-table__name-input"
      />
      <TableView testId="table-view" onCreate={handleCreate} />
    </>
  );
};

export default CreateTableView;
