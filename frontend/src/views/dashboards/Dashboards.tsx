import { useEffect, useState } from 'react';
import PVGridWebiny2 from '../../pv-react/PVGridWebiny2';
import {
  DashboardsReadReq,
  DashboardsReadRes,
  ReadPaginationFilter,
  ReadPaginationFilterFilters,
} from '../../pontus-api/typescript-fetch-client-generated';
import { ColDef, RowEvent } from 'ag-grid-community';
import { getAllDashboards } from '../../client';
import { capitalizeFirstLetter } from '../../webinyApi';
import { useDispatch } from 'react-redux';
import { setDashboardId } from '../../store/sliceDashboards';
import { redirect, useNavigate } from 'react-router-dom';
import PVFlexLayout from '../../pv-react/PVFlexLayout';
import DashboardView from '../DashboardView';
import { isEmpty } from '../../helpers/functions';

const Dashboards = () => {
  const dispatch = useDispatch();
  const [cols, setCols] = useState<ColDef[]>([
    {
      headerName: 'Owner',
      field: 'owner',
      filter: true,
      sortable: true,
    },
    {
      headerName: 'Folder',
      field: 'folder',
      filter: true,
      sortable: true,
    },
    {
      headerName: 'Name',
      field: 'name',
      filter: true,
      sortable: true,
    },
    {
      headerName: 'Id',
      field: 'id',
      filter: true,
      sortable: true,
    },
  ]);
  const [rows, setRows] = useState<{ [key: string]: unknown }[]>();
  const [filters, setFilters] = useState<{
    [key: string]: ReadPaginationFilterFilters;
  }>({});
  const [from, setFrom] = useState<number>(1);
  const [to, setTo] = useState<number>(5);
  const [totalCount, setTotalCount] = useState<number>(2);
  const [rowClicked, setRowClicked] = useState<RowEvent>();
  const [newDashboardName, setNewDashboardName] = useState<string>();
  const [deletion, setDeletion] = useState(false);
  const navigate = useNavigate();

  const [newDashboard, setNewDashboard] = useState(false);

  useEffect(() => {
    const fetchDashboars = async () => {
      console.log('fetching');
      try {
        const req: ReadPaginationFilter = {
          from,
          to,
          filters,
        };
        const res = await getAllDashboards(req);

        const rowsVal = res?.data?.dashboards?.map((dashboard) => {
          return {
            owner: dashboard?.owner,
            folder: dashboard?.folder,
            name: dashboard?.name,
            id: dashboard?.id,
          };
        });

        const totalRows = res?.data?.totalDashboards;

        const obj: ColDef[] = rowsVal
          ?.map((dashboard) => {
            return Object.keys(dashboard);
          })[0]
          .map((header) => {
            const obj: ColDef = {
              headerName: capitalizeFirstLetter(header),
              field: header,
              filter: true,
              sortable: true,
            };
            return obj;
          });
        console.log({ rowsVal, obj, totalRows });

        setRows(rowsVal);
        setTotalCount(totalRows || 0);
        setCols(obj);
      } catch (error) {}
    };

    fetchDashboars();
  }, [filters, to, from]);

  useEffect(() => {
    console.log({ rows, cols });
  }, [rows, cols]);

  const setDashboard = async () => {
    if (!rowClicked) return;
    console.log({ rowClicked });
    dispatch(setDashboardId(rowClicked.id));

    navigate(`/dashboard/${rowClicked.id}`);
  };

  const handleAddition = () => {
    navigate('/dashboard/create');
  };

  useEffect(() => {
    setDashboard();
  }, [rowClicked]);
  if (!rows) return;

  const handleFiltersChange = (filters: {
    [key: string]: ReadPaginationFilterFilters;
  }) => {
    if (isEmpty(filters)) return;

    setFilters(filters);
  };

  return (
    <div className="top-12 relative">
      {!newDashboard && (
        <>
          <PVGridWebiny2
            totalCount={totalCount}
            // setDeletion={set}
            rows={rows}
            add={handleAddition}
            cols={cols}
            onFiltersChange={handleFiltersChange}
            // setFrom={setFrom}
            // setTo={setTo}
            setRowClicked={setRowClicked}
          />

          <button
            onClick={() => setNewDashboard(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded shadow-sm hover:shadow-md"
          >
            Add New Dashboard
          </button>
        </>
      )}

      {newDashboard && (
        <>
          <label htmlFor="">Dashboard Name: </label>
          <input
            type="text"
            onChange={(e) => setNewDashboardName(e.target.value)}
          />
          <DashboardView createMode={true} dashboardName={newDashboardName} />
        </>
      )}
    </div>
  );
};

export default Dashboards;
