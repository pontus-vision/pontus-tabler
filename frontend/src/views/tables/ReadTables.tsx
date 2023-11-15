import { useEffect, useState } from 'react';
import PVFlexLayout from '../../pv-react/PVFlexLayout';
import PVGridWebiny2 from '../../pv-react/PVGridWebiny2';
import {
  ReadPaginationFilter,
  ReadPaginationFilterFilters,
  TableRef,
  User,
} from '../../pontus-api/typescript-fetch-client-generated';
import { getTables } from '../../client';
import { ColDef, IGetRowsParams, RowEvent } from 'ag-grid-community';
import { useNavigate } from 'react-router-dom';
import { isEmpty } from '../../helpers/functions';

const TablesReadView = () => {
  const [cols, setCols] = useState<ColDef[]>([
    { headerName: 'Name', field: 'name', filter: true },
  ]);
  const [rows, setRows] = useState<TableRef[]>();
  const [filters, setFilters] = useState<{
    [key: string]: ReadPaginationFilterFilters;
  }>({});
  const [from, setFrom] = useState<number>(1);
  const [to, setTo] = useState<number>(8);
  const [totalCount, setTotalCount] = useState<number>(2);
  const [deleteMode, setDeleteMode] = useState(false);
  const [deletion, setDeletion] = useState(false);
  const [entriesToBeDeleted, setEntriesToBeDeleted] = useState<User[]>([]);
  const navigate = useNavigate();

  const fetchTables = async () => {
    console.log('fetching');
    try {
      const req: ReadPaginationFilter = {
        from,
        to,
        filters,
      };
      console.log({ req });

      const data = await getTables(req);

      const entries = data?.data.tables;
      // setCols([...cols, ...data?.data.tables?.map()])

      console.log({ entries });
      setRows(entries);
      setTotalCount(data?.data.totalTables || 2);
    } catch {
      setRows([]);
    }
  };

  useEffect(() => {
    fetchTables();
  }, [filters, from, to]);

  const handleUpdate = (data: TableRef) => {
    navigate('/table/update/' + data.id, { state: data });
  };

  useEffect(() => {
    console.log({ entriesToBeDeleted, deleteMode, deletion });
  }, [entriesToBeDeleted, deleteMode, deletion]);

  const handleOnRefresh = () => {
    fetchTables();
  };

  const handleParamsChange = (params: IGetRowsParams) => {
    setFilters(params.filterModel);
    setFrom(params.startRow + 1);
    setTo(params.endRow);
  };

  const handleRowClicked = (row: RowEvent<any, any>) => {
    navigate(`/table/read/${row.data.id}`);
  };

  if (!rows) return;

  return (
    <div className="read-tables__container">
      <PVGridWebiny2
        onUpdate={handleUpdate}
        // onFiltersChange={handleFiltersChange}
        totalCount={totalCount}
        onFromChange={(num: number) => {
          console.log({ num });
        }}
        onParamsChange={handleParamsChange}
        onRefresh={handleOnRefresh}
        cols={cols}
        onRowClicked={handleRowClicked}
        setEntriesToBeDeleted={setEntriesToBeDeleted}
        deleteMode={deleteMode}
        setDeletion={setDeletion}
        rows={rows}
      />
    </div>
  );
};

export default TablesReadView;
