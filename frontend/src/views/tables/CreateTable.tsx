import { useEffect, useState } from 'react';
import { createTable, tableRead } from '../../client';
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

  function modifyString(str) {
    // Step 1: Remove any character that doesn't match the pattern [a-zA-Z0-9]
    let modifiedStr = str.replace(/[^a-zA-Z0-9_-]/g, '');
 
    // Step 2: Replace all instances of '-' that are not preceded by '_' or '-' and are not followed by '_' or '-'
    // Since JavaScript does not support negative lookbehind and lookahead in all environments,
    // we need to handle this in a different way.
    // We can split the string by '-', then filter out any element that starts or ends with '_'
    // Then join them back together with '-'
    modifiedStr = modifiedStr.split('-').filter(word => !word.startsWith('_') && !word.endsWith('_')).join('-');
 
    return modifiedStr;
 }

  const handleCreate = async (data: TableColumnRef[]) => {
    setName('');
    try {
      const obj = { ...data, name }
      console.log({obj})
      const createRes = await createTable({
        label: name || "",
        name: modifyString(name),
        cols: data.map(col=>{return {...col, name: modifyString(col.name)}})
      });
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
