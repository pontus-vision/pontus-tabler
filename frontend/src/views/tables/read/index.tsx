import { useEffect, useState } from 'react';
import PVFlexLayout from '../../../pv-react/PVFlexLayout';
import PVGridWebiny2 from '../../../pv-react/PVGridWebiny2';
<<<<<<< HEAD
import {
  ReadPaginationFilter,
  ReadPaginationFilterFilters,
} from '../../../pontus-api/typescript-fetch-client-generated';
=======
import { ReadPaginationFilter } from '../../../pontus-api/typescript-fetch-client-generated';
>>>>>>> 11bffbe22235cf5f6b73b6ee5b722d2342fa5a44
import { getTables } from '../../../client';
import { ColDef } from 'ag-grid-community';

const TablesReadView = () => {
  const [cols, setCols] = useState<ColDef[]>([
    { headerName: 'Table', field: 'table', filter: true },
    { headerName: 'Cols', field: 'cols', filter: true },
  ]);
  const [rows, setRows] = useState<{ [key: string]: unknown }[]>();
<<<<<<< HEAD
  const [filters, setFilters] = useState<ReadPaginationFilterFilters>();
=======
  const [filters, setFilters] = useState<ReadPaginationFilter>();
>>>>>>> 11bffbe22235cf5f6b73b6ee5b722d2342fa5a44
  const [from, setFrom] = useState<number>();
  const [to, setTo] = useState<number>();
  const [totalCount, setTotalCount] = useState<number>();

  useEffect(() => {
    const fetchTables = async () => {
      const data = await getTables();

      const entries = data?.data.tables?.map((table) => {
        return {
          table: table.name,
          cols: table.cols?.map((col) => col.name).join(', '),
        };
      });
      console.log({ data });
      setRows(entries);
      setTotalCount(data?.data.totalTables || 2);
    };

    fetchTables();
  }, []);

<<<<<<< HEAD
  useEffect(() => {
    console.log({ filters });
  }, [filters]);

  if (!totalCount) return;

  return (
    <PVGridWebiny2
      setFilters={setFilters}
      totalCount={totalCount}
      cols={cols}
      rows={rows}
    />
  );
=======
  if (!totalCount) return;

  return <PVGridWebiny2 totalCount={totalCount} cols={cols} rows={rows} />;
>>>>>>> 11bffbe22235cf5f6b73b6ee5b722d2342fa5a44
};

export default TablesReadView;
