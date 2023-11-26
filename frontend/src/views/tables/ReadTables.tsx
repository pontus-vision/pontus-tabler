import { useEffect, useState } from 'react';
import PVFlexLayout from '../../pv-react/PVFlexLayout';
import PVGridWebiny2 from '../../pv-react/PVGridWebiny2';
import {
  BaseModelRef,
  ReadPaginationFilter,
  ReadPaginationFilterFilters,
  TableDeleteReq,
  TableRef,
  TableUpdateReq,
  User,
} from '../../pontus-api/typescript-fetch-client-generated';
import { deleteTable, getTables } from '../../client';
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
  const [totalCount, setTotalCount] = useState<number>();
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

      setRows(entries);
      setTotalCount(data?.data.totalTables || 2);
    } catch {
      setRows([]);
    }
  };

  useEffect(() => {
    fetchTables();
  }, [filters, from, to]);

  const handleUpdate = (data: TableUpdateReq) => {
    navigate('/table/update/' + data.id, { state: data });
  };

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
  const handleAddition = () => {
    navigate('/table/create');
  };

  const handleDelete = async (arr: TableDeleteReq[]) => {
    arr.forEach(async (el) => {
      console.log({ el });

      const res = await deleteTable(el);
    });
    fetchTables();
  };

  if (!rows) return;

  return (
    <div className="read-tables__container">
      <PVGridWebiny2
        testId="read-tables-aggrid"
        onUpdate={handleUpdate}
        totalCount={totalCount}
        onParamsChange={handleParamsChange}
        onRefresh={handleOnRefresh}
        cols={cols}
        onDelete={handleDelete}
        onRowClicked={handleRowClicked}
        setEntriesToBeDeleted={setEntriesToBeDeleted}
        deleteMode={deleteMode}
        setDeletion={setDeletion}
        rows={rows}
        add={handleAddition}
        permissions={{
          updateAction: true,
          createAction: true,
          deleteAction: true,
          readAction: true,
        }}
      />
    </div>
  );
};

export default TablesReadView;
