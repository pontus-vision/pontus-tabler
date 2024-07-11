import { useEffect, useRef, useState } from 'react';
import PVGridWebiny2 from '../../pv-react/PVGridWebiny2';
import { Dashboard, ReadPaginationFilterFilters } from '../../typescript/api';
import { IGetRowsParams } from '@ag-grid-community/core';
import { useNavigate } from 'react-router-dom';
import { deleteDashboard, getAllDashboards } from '../../client';
import { MessageRefs } from '../../components/NotificationManager';
import { ColDef, IRowNode, RowEvent } from 'ag-grid-community';
import useApiAndNavigate from '../../hooks/useApi';
import { DashboardsReadReq } from '../../typescript/serialization';

type Props = {
  onRowClicked?: (row: RowEvent<any, any>) => void;
  onAdd?: () => void;
  onUpdate?: () => void;
  onDelete?: () => void;
  actions?: {
    updateAction?: boolean;
    createAction?: boolean;
    deleteAction?: boolean;
    readAction?: boolean;
  };
  selection?: boolean;
  dashboardsToFilterOutById?: Dashboard[];
  onRowsSelected?: (e: IRowNode<any>[]) => void;
  onRowsStateChange?: (data: Record<string, any>[]) => void;
};

const FetchDashboards = ({
  onRowClicked,
  onAdd,
  onUpdate,
  onDelete,
  actions,
  selection,
  onRowsSelected,
  onRowsStateChange,
  dashboardsToFilterOutById,
}: Props) => {
  const [dashboards, setDashboards] = useState<Dashboard[]>();

  const [from, setFrom] = useState<number>(1);
  const [to, setTo] = useState<number>(100);
  const [filters, setFilters] = useState<{
    [key: string]: ReadPaginationFilterFilters;
  }>({});
  const [cols, setCols] = useState<ColDef[]>([
    {
      headerName: 'Name',
      field: 'name',
      filter: true,
      sortable: true,
    },
    {
      headerName: 'Owner',
      field: 'owner',
      filter: true,
      sortable: true,
    },
    {
      headerName: 'Id',
      field: 'id',
      filter: true,
      sortable: true,
    },
    {
      headerName: 'Folder',
      field: 'folder',
      filter: true,
      sortable: true,
    },
  ]);
  const [totalDashboards, setTotalDashboards] = useState<number>();
  const notificationManagerRef = useRef<MessageRefs>();
  const [isLoading1, setIsLoading1] = useState(false);
  const navigate = useNavigate();
  const {fetchDataAndNavigate} = useApiAndNavigate()


  const fetchDashboards = async () => {
    setIsLoading1(true);
    
    const req: DashboardsReadReq = {
      from, to, filters
    }


    const res = await fetchDataAndNavigate(getAllDashboards, req)


    

    console.log({ res });
    if (res?.status === 404) {
      setDashboards([]);
      setTotalDashboards(0);
    } else if (res?.status === 500) {
      notificationManagerRef?.current?.addMessage(
        'error',
        'Error',
        'Something went wrong. Could not fetch Dashboard(s)!',
      );
    }

    if (dashboardsToFilterOutById) {
      const filtered = res?.data.dashboards?.filter(
        (dash1) =>
          !dashboardsToFilterOutById.some((dash2) => dash1.id === dash2.id),
      );

      setDashboards(filtered);
      setTotalDashboards(filtered?.length);
    } else {
      setDashboards(res?.data.dashboards);
      setTotalDashboards(res?.data.totalDashboards);
    }

    setIsLoading1(false);
  };

  useEffect(() => {
    fetchDashboards();
  }, []);

  const handleParamsChange = (params: IGetRowsParams) => {
    setFilters(params.filterModel);
    setFrom(params.startRow + 1);
    setTo(params.endRow);
  };
  const handleAddition = () => {
    navigate('/dashboard/create');
  };

  const handleDelete = (arr: Dashboard[]) => {
    arr.forEach(async (item) => {
      if (!item?.id) return;
      const res = await deleteDashboard(item.id);
      console.log(res);
    });
    fetchDashboards();
  };

  const handleDashboardUpdate = (row: Dashboard) => {
    navigate(`/dashboard/update/${row?.id}`);
  };

  return (
    <PVGridWebiny2
      cols={cols}
      rows={dashboards}
      cypressAtt="dashboards-grid"
      isLoading={isLoading1}
      add={() => (onAdd ? onAdd() : handleAddition())}
      permissions={actions}
      onParamsChange={handleParamsChange}
      totalCount={totalDashboards}
      selection={selection}
      onUpdate={onUpdate || handleDashboardUpdate}
      onRefresh={() => fetchDashboards()}
      onDelete={onDelete || handleDelete}
      onRowClicked={onRowClicked}
      onRowsSelected={onRowsSelected}
      onRowsStateChange={onRowsStateChange}
    />
  );
};

export default FetchDashboards;
