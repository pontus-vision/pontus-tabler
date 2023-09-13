import { useEffect, useState } from 'react';
import PVFlexLayout from '../../pv-react/PVFlexLayout';
import PVGridWebiny2 from '../../pv-react/PVGridWebiny2';
import {
  ReadPaginationFilter,
  ReadPaginationFilterFilters,
  Table,
  User,
} from '../../pontus-api/typescript-fetch-client-generated';
import { getTables } from '../../client';
import { ColDef } from 'ag-grid-community';
import { useNavigate } from 'react-router-dom';

const TablesReadView = () => {
  const [cols, setCols] = useState<ColDef[]>([
    { headerName: 'Table', field: 'table', filter: true },
    { headerName: 'Cols', field: 'cols', filter: true },
  ]);
  const [rows, setRows] = useState<{ [key: string]: unknown }[]>();
  const [filters, setFilters] = useState<ReadPaginationFilterFilters>();
  const [from, setFrom] = useState<number>();
  const [to, setTo] = useState<number>();
  const [totalCount, setTotalCount] = useState<number>();
  const [deleteMode, setDeleteMode] = useState(false);
  const [deletion, setDeletion] = useState(false);
  const [entriesToBeDeleted, setEntriesToBeDeleted] = useState<User[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTables = async () => {
      const data = await getTables();

      const entries = data?.data.tables?.map((table) => {
        return {
          table: table.name,
          cols: table.cols?.map((col) => col.name).join(', '),
          tableId: table.tableId,
        };
      });
      console.log({ data });
      setRows(entries);
      setTotalCount(data?.data.totalTables || 2);
    };

    fetchTables();
  }, []);

  useEffect(() => {
    console.log({ filters });
  }, [filters]);

  const handleUpdate = (data: Table) => {
    navigate('/table/update/' + data.tableId, { state: data });
  };

  useEffect(() => {
    console.log({ entriesToBeDeleted, deleteMode, deletion });
  }, [entriesToBeDeleted, deleteMode, deletion]);

  if (!totalCount) return;

  return (
    <div className="read-tables__container">
      <PVGridWebiny2
        onUpdate={handleUpdate}
        setFilters={setFilters}
        totalCount={totalCount}
        cols={cols}
        setEntriesToBeDeleted={setEntriesToBeDeleted}
        deleteMode={deleteMode}
        setDeletion={setDeletion}
        rows={rows}
      />
    </div>
  );
};

export default TablesReadView;
