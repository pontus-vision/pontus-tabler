import { useEffect, useRef, useState } from 'react';
import {
  createDashboardGroupAuth,
  deleteDashboardGroupAuth,
  getAllDashboards,
  readDashboardGroupAuth,
  updateDashboardGroupAuth,
} from '../client';
import {
  Dashboard,
  DashboardAuthGroups,
  ReadPaginationFilterFilters,
} from '../typescript/api';
import PVGridWebiny2 from '../pv-react/PVGridWebiny2';
import {
  CellValueChangedEvent,
  ColDef,
  IGetRowsParams,
} from 'ag-grid-community';
import styles from './DashboardAuthGroupsView.module.scss';
import NotificationManager, {
  MessageRefs,
} from '../components/NotificationManager';
import { deepEqual } from '../../utils';

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
      headerName: 'Folder',
      field: 'folder',
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

  const [selectedDashboard, setSelectedDashboard] =
    useState<Dashboard | null>();
  const [groupsChanged, setGroupsChanged] = useState<CellValueChangedEvent[]>(
    [],
  );
  const [groups, setGroups] = useState<any[]>([]);

  const [totalGroups, setTotalGroups] = useState<number>();
  const [totalDashboards, setTotalDashboards] = useState<number>();
  const [addGroup, setAddGroup] = useState(false);
  const [newGroups, setNewGroups] = useState<Dashboard[]>([]);
  const notificationManagerRef = useRef<MessageRefs>();
  const [isLoading1, setIsLoading1] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);

  const fetchDashboards = async () => {
    setIsLoading1(true);
    const res = await getAllDashboards({ from: 1, to: 100, filters: {} });

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

    setDashboards(res?.data.dashboards);
    setTotalDashboards(res?.data.totalDashboards);
    setIsLoading1(false);
  };

  const fetchDashboardAuthGroups = async () => {
    if (!selectedDashboard?.id) return;
    setIsLoading2(true);
    const res = await readDashboardGroupAuth({
      dashboardId: selectedDashboard?.id,
      filters,
      from,
      to,
    });

    if (res?.status === 404) {
      setGroups([]);
      setTotalGroups(0);
    } else if (res?.status === 500) {
      notificationManagerRef?.current?.addMessage(
        'error',
        'Error',
        'Something went wrong. Could not fetch Auth Group(s)!',
      );
    }

    const authGroups = res?.data.authGroups;
    const totalCount = res?.data.totalCount;

    authGroups && setGroups(authGroups);
    totalCount && setTotalGroups(totalCount);
    setIsLoading2(false);
  };

  const updateDashboardAuthGroup = async () => {
    if (!selectedDashboard?.id || !groupsChanged) return;

    console.log({ groupsChanged });

    const res = await updateDashboardGroupAuth({
      dashboardId: selectedDashboard?.id,
      authGroups: groupsChanged,
    });

    if (res?.status === 200) {
      notificationManagerRef?.current?.addMessage(
        'success',
        'Success',
        'Auth group(s) updated!',
      );

      await fetchDashboardAuthGroups();
    } else {
      notificationManagerRef?.current?.addMessage(
        'error',
        'Error',
        'Something went wrong. Could not update Auth Group(s)!',
      );
    }
  };

  useEffect(() => {
    fetchDashboardAuthGroups();
  }, [selectedDashboard, filters, to, from]);

  useEffect(() => {
    fetchDashboards();
  }, []);

  const handleParamsChange = (params: IGetRowsParams) => {
    setFilters(params.filterModel);
    setFrom(params.startRow + 1);
    setTo(params.endRow);
  };

  const addDashboardAuthGroups = async () => {
    if (!selectedDashboard?.id) return;
    const res = await createDashboardGroupAuth({
      dashboardId: selectedDashboard?.id,
      authGroups: newGroups.map((group) => {
        return {
          groupName: group.groupName,
          groupId: group.groupId,
          create: false,
          delete: false,
          read: false,
          update: false,
        };
      }),
    });

    if (res?.status === 200) {
      notificationManagerRef?.current?.addMessage(
        'success',
        'Success',
        'Auth group created!',
      );

      await fetchDashboardAuthGroups();
    } else {
      notificationManagerRef?.current?.addMessage(
        'error',
        'Error',
        'Something went wrong. Could not create Auth Group!',
      );
    }
  };

  const deleteDashboardsAuthGroup = async (data: DashboardAuthGroups[]) => {
    if (!selectedDashboard?.id) return;
    const ids = data.map((el) => el.groupId);

    const res = await deleteDashboardGroupAuth({
      authGroups: ids,
      dashboardId: selectedDashboard?.id,
    });

    if (res?.status === 200) {
      notificationManagerRef?.current?.addMessage(
        'success',
        'Success',
        'Auth Group(s) deleted!',
      );
      await fetchDashboardAuthGroups();
    } else {
      notificationManagerRef?.current?.addMessage(
        'error',
        'Error',
        'Something wrong happened! Could not delete.',
      );
    }
  };

  useEffect(() => {}, []);

  return (
    <div className={styles.dashboardAuthGroupsView}>
      <label htmlFor="">{selectedDashboard?.name}</label>
      <div className={styles.dashboardAuthGroupsViewContainer}>
        <PVGridWebiny2
          cols={cols}
          rows={dashboards}
          isLoading={isLoading2}
          totalCount={totalDashboards}
          onRowClicked={(e) => {
            setSelectedDashboard(null);
            setTimeout(() => {
              setSelectedDashboard(e.data);
            }, 1);
          }}
        />
        {selectedDashboard?.id && (
          <>
            <PVGridWebiny2
              add={() => setAddGroup(true)}
              onRowsStateChange={(e) => setGroupsChanged(e)}
              onDelete={(e) => deleteDashboardsAuthGroup(e)}
              permissions={{ createAction: true, deleteAction: true }}
              onParamsChange={handleParamsChange}
              isLoading={isLoading2}
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
              onRowsSelected={(e) => console.log(e)}
              totalCount={totalGroups}
            />
            {groupsChanged.length > 0 && (
              <button
                onClick={() => updateDashboardAuthGroup()}
                className={styles.updateBtn}
              >
                Update AuthGroup(s)
              </button>
            )}
          </>
        )}

        {addGroup && (
          <>
            <div
              className={styles.dashboardAuthGroupsViewShadow}
              onClick={() => setAddGroup(false)}
            ></div>
            <div className={styles.selectGroup}>
              <PVGridWebiny2
                onParamsChange={handleParamsChange}
                cols={[
                  {
                    headerClass: 'Name',
                    field: 'groupName',
                    sortable: true,
                    filter: true,
                  },
                  {
                    headerClass: 'Group Id',
                    field: 'groupId',
                    sortable: true,
                    filter: true,
                  },
                ]}
                onRowsSelected={(e) => setNewGroups(e.map((el) => el.data))}
                selection={true}
                rows={[{ groupName: 'foo2', groupId: 'bar2' }]}
                totalCount={1}
              />
              <button onClick={() => addDashboardAuthGroups()}>
                Add Group(s)
              </button>
            </div>
          </>
        )}
      </div>
      <NotificationManager ref={notificationManagerRef} />
    </div>
  );
};

export default DashboardAuthGroupsView;
