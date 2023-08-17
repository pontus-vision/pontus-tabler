import { useEffect, useState } from 'react';
import PVFlexLayout from '../../../pv-react/PVFlexLayout';
import PVGridWebiny2 from '../../../pv-react/PVGridWebiny2';
import { ReadPaginationFilter } from '../../../pontus-api/typescript-fetch-client-generated';
import { getTables } from '../../../client';
import { ColDef } from 'ag-grid-community';

const TablesReadView = () => {
  const [cols, setCols] = useState<ColDef[]>([
    { headerName: 'Table', field: 'table', filter: true },
    { headerName: 'Cols', field: 'cols', filter: true },
  ]);
  const [rows, setRows] = useState<{ [key: string]: unknown }[]>();
  const [filters, setFilters] = useState<ReadPaginationFilter>();
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

  if (!totalCount) return;

  return <PVGridWebiny2 totalCount={totalCount} cols={cols} rows={rows} />;
};

export default TablesReadView;
