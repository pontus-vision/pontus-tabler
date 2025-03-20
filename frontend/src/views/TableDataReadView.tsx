import { useParams } from 'react-router-dom';
import PVGridWebiny2 from '../pv-react/PVGridWebiny2';
import { useEffect, useState } from 'react';
import { tableDataRead, tableRead } from '../client';
import { ColDef } from 'ag-grid-community';
import {
  ReadPaginationFilter,
  ReadPaginationFilterFilters,
} from '../pontus-api/typescript-fetch-client-generated';

const TableDataReadView = () => {
  const tableId = useParams().id;
  const [colDefs, setColDefs] = useState<ColDef[]>();
  const [tableName, setTableName] = useState<string>('');
  const [filters, setFilters] = useState<ReadPaginationFilter>();

  useEffect(() => {
    const fetchTable = async (tableId: string) => {
      const res = await tableRead({ id: tableId });

      setColDefs(
        res?.data.cols?.map((col) => {
          return { ...col, editable: true };
        }),
      );

      console.log({
        res
      })
      setTableName(res?.data.name || '');
    };

    tableId && fetchTable(tableId);
  }, [tableId]);

  useEffect(() => {
    const fetchTableData = async () => {
      const res = await tableDataRead({
        tableName: tableName,
        ...filters,
      });
    };
  }, [tableName, filters]);

  const handleFiltersChange = (filters: ReadPaginationFilter) => {
    filters && setFilters(filters);
  };

  return (
    <>
      {colDefs && (
        <PVGridWebiny2 add={() => { console.log('foo') }} onFiltersChange={handleFiltersChange} cols={colDefs} />
      )}
    </>
  );
};

export default TableDataReadView;
