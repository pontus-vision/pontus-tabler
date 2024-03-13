import { useEffect, useState } from 'react';
import { getAllDashboards } from '../client';
import {
  Dashboard,
  ReadPaginationFilter,
  ReadPaginationFilterFilters,
} from '../typescript/api';
import PVGridWebiny2 from '../pv-react/PVGridWebiny2';
import { ColDef } from 'ag-grid-community';
import styles from './DashboardAuthGroupsView.module.scss';

const DashboardAuthGroupsView = () => {
  const [dashboards, setDashboards] = useState<Dashboard[]>();
  const [from, setFrom] = useState<number>();
  const [to, setTo] = useState<number>();
  const [filters, setFilters] = useState<{
    [key: string]: ReadPaginationFilterFilters;
  }>({});

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

  const fetchDashboards = async () => {
    const res = await getAllDashboards({ from, to, filters });

    setDashboards(res?.data.dashboards);
  };

  useEffect(() => {
    fetchDashboards();
  }, []);

  return (
    <div className={styles.dashboardAuthGroupsView}>
      <PVGridWebiny2
        cols={cols}
        rows={dashboards}
        onRowClicked={(e) => setSelectedDashboard()}
      />
      <PVGridWebiny2
        cols={[
          {
            headerName: 'Group',
            field: 'group',
            editable: true,
          },
          {
            headerName: 'Create',
            field: 'create',
            editable: true,
            cellEditor: 'agCheckboxCellEditor',
            cellRenderer: 'agCheckboxCellRenderer',
          },
          {
            headerName: 'Delete',
            field: 'delete',
            editable: true,
            cellEditor: 'agCheckboxCellEditor',
            cellRenderer: 'agCheckboxCellRenderer',
          },
          {
            headerName: 'Update',
            field: 'update',
            editable: true,
            cellEditor: 'agCheckboxCellEditor',
            cellRenderer: 'agCheckboxCellRenderer',
          },
        ]}
        rows={[{ group: false }]}
        totalCount={1}
      />
    </div>
  );
};

export default DashboardAuthGroupsView;
