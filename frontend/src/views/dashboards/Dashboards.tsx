import { useEffect, useRef, useState } from 'react';
import {
  createDashboardGroupAuth,
  deleteDashboard,
  deleteDashboardGroupAuth,
  getAllDashboards,
  readDashboardGroupAuth,
  updateDashboardGroupAuth,
} from '../../client';
import {
  AuthGroupRef,
  Dashboard,
  DashboardAuthGroups,
  MenuItemTreeRef,
  ReadPaginationFilterFilters,
} from '../../typescript/api';
import PVGridWebiny2 from '../../pv-react/PVGridWebiny2';
import {
  CellValueChangedEvent,
  ColDef,
  IGetRowsParams,
  RowEvent,
} from 'ag-grid-community';
import styles from './DashboardAuthGroupsView.module.scss';
import NotificationManager, {
  MessageRefs,
} from '../../components/NotificationManager';
import { deepEqual } from '../../../utils';
import { useNavigate } from 'react-router-dom';
import FetchDashboards from '../dashboard/FetchDashboards';
import AuthGroups from '../authGroups/AuthGroups';
import MenuTree from '../../components/MenuTree';

const Dashboards = () => {
  const [groupsChanged, setGroupsChanged] = useState<DashboardAuthGroups[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [from, setFrom] = useState<number>();
  const [to, setTo] = useState<number>();
  const [filters, setFilters] = useState<{
    [key: string]: ReadPaginationFilterFilters;
  }>({
    groupName: { filter: '', filterType: 'text', type: 'contains' },
  });
    const [addGroup, setAddGroup] = useState(false);
  const [newGroups, setNewGroups] = useState<AuthGroupRef[]>([]);
  const notificationManagerRef = useRef<MessageRefs>();
  const [selectedDashboard, setSelectedDashboard] =
    useState<Dashboard | null>();
  const [isLoading2, setIsLoading2] = useState(false);
  const [totalGroups, setTotalGroups] = useState<number>();

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

  const addDashboardAuthGroups = async () => {
    if (!selectedDashboard?.id) return;
    console.log({ newGroups });
    const res = await createDashboardGroupAuth({
      dashboardId: selectedDashboard?.id,
      authGroups: newGroups.map((group) => {
        return {
          groupName: group.name,
          groupId: group.id,
          create: false,
          delete: false,
          read: false,
          update: false,
        };
      }),
    });

    console.log({ res });

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

  const handleParamsChange = (params: IGetRowsParams) => {
    setFilters(params.filterModel);
    setFrom(params.startRow + 1);
    setTo(params.endRow);
  };

  

  return (
    <div className={styles.dashboardAuthGroupsView}>
      {addGroup && (
        <div
          className={styles.dashboardAuthGroupsViewShadow}
          onClick={() => setAddGroup(false)}
        ></div>
      )}
      

      <div className={styles.dashboardAuthGroupsViewContainer}>
        {/* <div></div> */}
        <FetchDashboards
          onRowClicked={(e) => {
            setSelectedDashboard(null);
            setTimeout(() => {
              setSelectedDashboard(e.data);
            }, 1);
          }}
          actions={{
            createAction: true,
            deleteAction: true,
            readAction: true,
            updateAction: true,
          }}
        />
        {selectedDashboard?.id && (
          <div className={styles.authGroupsGrid}>
            <label htmlFor="">{selectedDashboard?.name} Auth Groups:</label>
            <PVGridWebiny2
              add={() => setAddGroup(true)}
              onRowsStateChange={(e) => {
                setGroupsChanged(e as DashboardAuthGroups[]);
              }}
              updateModeOnRows={true}
              onUpdate={updateDashboardAuthGroup}
              onRefresh={() => fetchDashboardAuthGroups()}
              onDelete={(e) => deleteDashboardsAuthGroup(e)}
              permissions={{
                updateAction: true,
                createAction: true,
                deleteAction: true,
              }}
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
                  // hide: true,
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
          </div>
        )}

        {addGroup && (
          <>
            <div className={styles.selectGroup}>
              <AuthGroups
                onRowsSelected={(e) => setNewGroups(e.map((el) => el.data))}
                selection={true}
                permissions={{
                  updateAction: false,
                  createAction: false,
                  deleteAction: false,
                  readAction: true,
                }}
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

export default Dashboards;
