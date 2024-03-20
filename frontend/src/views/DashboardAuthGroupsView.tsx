import { useEffect, useState } from 'react';
import { getAllDashboards, readDashboardGroupAuth } from '../client';
import {
  Dashboard,
  ReadPaginationFilter,
  ReadPaginationFilterFilters,
} from '../typescript/api';
import PVGridWebiny2 from '../pv-react/PVGridWebiny2';
import { ColDef, IGetRowsParams } from 'ag-grid-community';
import styles from './DashboardAuthGroupsView.module.scss';

const DashboardAuthGroupsView = () => {
  const [dashboards, setDashboards] = useState<Dashboard[]>();
  const [from, setFrom] = useState<number>();
  const [to, setTo] = useState<number>();
  const [filters, setFilters] = useState<{
    [key: string]: ReadPaginationFilterFilters;
  }>({
    groupName: { filter: '', filterType: 'text', type: 'contains' },
  });
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

  const [selectedDashboard, setSelectedDashboard] = useState<Dashboard>();

  const [groups, setGroups] = useState<any[]>([]);
  const [totalGroups, setTotalGroups] = useState<number>();
  const [addGroup, setAddGroup] = useState(false);

  const fetchDashboards = async () => {
    const res = await getAllDashboards({ from: 1, to: 5, filters: {} });
    setDashboards(res?.data.dashboards);
  };

  const fetchDashboardAuthGroups = async () => {
    if (!selectedDashboard?.id) return;

    const res = await readDashboardGroupAuth({
      dashboardId: selectedDashboard?.id,
      filters,
    });
    console.log({ res });

    if (res?.status === 404) {
      setGroups([]);
    }

    const authGroups = res?.data.authGroups;
    const totalCount = res?.data.totalCount;

    authGroups && setGroups(authGroups);
    totalCount && setTotalGroups(totalCount);

    // for (const prop in authGroups) {
    //   authGroups[prop].forEach((el) => {
    //     setPerms((prevState) =>
    //       [
    //         ...prevState,
    //         {
    //           group: el.groupName,
    //           id: el.groupId,
    //           create: false,
    //           read: false,
    //           update: false,
    //           delete: false,
    //           [prop]: !!el,
    //         },
    //       ].reduce((acc, cur) => {
    //         const existingIndex = acc.findIndex(
    //           (item) => item.group === cur.group && item.id === cur.id,
    //         );

    //         if (existingIndex !== -1) {
    //           // Merge permissions by setting each to true if either is true
    //           acc[existingIndex] = {
    //             ...acc[existingIndex],
    //             create: acc[existingIndex].create || cur.create,
    //             read: acc[existingIndex].read || cur.read,
    //             update: acc[existingIndex].update || cur.update,
    //             delete: acc[existingIndex].delete || cur.delete,
    //           };
    //         } else {
    //           // If no existing object, just add the curent object
    //           acc.push(cur);
    //         }

    //         return acc;
    //       }, []),
    //     );
    //   });
    // }
  };

  useEffect(() => {
    fetchDashboardAuthGroups();
    console.log({ dashboardId: selectedDashboard, filters, to, from });
  }, [selectedDashboard, filters, to, from]);

  useEffect(() => {
    fetchDashboards();
  }, []);

  const handleParamsChange = (params: IGetRowsParams) => {
    setFilters(params.filterModel);
    setFrom(params.startRow + 1);
    setTo(params.endRow);
  };

  return (
    <div className={styles.dashboardAuthGroupsView}>
      <label htmlFor="">{selectedDashboard?.name}</label>
      <div className={styles.dashboardAuthGroupsViewContainer}>
        <PVGridWebiny2
          cols={cols}
          rows={dashboards}
          onRowClicked={(e) => setSelectedDashboard(e.data)}
        />
        {selectedDashboard && (
          <PVGridWebiny2
            add={() => setAddGroup(true)}
            permissions={{ createAction: true }}
            onParamsChange={handleParamsChange}
            cols={[
              {
                headerName: 'Group',
                field: 'groupName',
                editable: true,
              },
              {
                headerName: 'Group Id',
                field: 'groupId',
                hide: true,
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
                headerName: 'Read',
                field: 'read',
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
              {
                headerName: 'Delete',
                field: 'delete',
                editable: true,
                cellEditor: 'agCheckboxCellEditor',
                cellRenderer: 'agCheckboxCellRenderer',
              },
            ]}
            rows={groups}
            totalCount={totalGroups}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardAuthGroupsView;
