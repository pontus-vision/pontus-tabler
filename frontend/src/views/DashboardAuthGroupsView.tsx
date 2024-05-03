import { useEffect, useRef, useState } from 'react';
import {
  createAuthGroup,
  createAuthGroupDashboards,
  createAuthGroupUsers,
  createDashboard,
  createDashboardGroupAuth,
  deleteAuthGroupDashboards,
  deleteAuthGroupUsers,
  deleteDashboard,
  deleteDashboardGroupAuth,
  getAllDashboards,
  readAuthGroups,
  readAuthGroupsDashboards,
  readAuthGroupsUsers,
  readDashboardGroupAuth,
  updateAuthGroupDashboards,
  updateAuthGroups,
  updateDashboardGroupAuth,
} from '../client';
import {
  AuthGroupDashboardRef,
  AuthGroupRef,
  AuthUserRef,
  Dashboard,
  DashboardAuthGroups,
  ReadPaginationFilterFilters,
} from '../typescript/api';
import PVGridWebiny2 from '../pv-react/PVGridWebiny2';
import {
  CellClickedEvent,
  CellValueChangedEvent,
  ColDef,
  IGetRowsParams,
  RowEvent,
} from 'ag-grid-community';
import styles from './DashboardAuthGroupsView.module.scss';
import NotificationManager, {
  MessageRefs,
} from '../components/NotificationManager';
import { deepEqual } from '../../utils';
import { useNavigate } from 'react-router-dom';
import SimpleTextEditor from '../pv-react/simpleTextEditor';
import FetchDashboards from './dashboard/FetchDashboards';
import { slice } from 'cypress/types/lodash';
import AuthGroups from './authGroups/AuthGroups';
import AuthUsersGrid from '../components/AuthUsersGrid';

const DashboardAuthGroupsView = () => {
  const [groups, setAuthGroups] = useState<AuthGroupRef[]>([]);
  const [from, setFrom] = useState<number>(1);
  const [to, setTo] = useState<number>(100);
  const [filters, setFilters] = useState<{
    [key: string]: ReadPaginationFilterFilters;
  }>({
    groupName: { filter: '', filterType: 'text', type: 'contains' },
  });

  const [fromDashboards, setFromDashboards] = useState<number>(1);
  const [toDashboards, setToDashboards] = useState<number>(100);
  const [filtersDashboards, setFiltersDashboards] = useState<{
    [key: string]: ReadPaginationFilterFilters;
  }>({
    groupName: { filter: '', filterType: 'text', type: 'contains' },
  });

  const [fromUsers, setFromUsers] = useState<number>(1);
  const [toUsers, setToUsers] = useState<number>(100);
  const [filtersUsers, setFiltersUsers] = useState<{
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

  const [addMode, setAddMode] = useState(false);

  const [selectedGroup, setSelectedGroup] = useState<AuthGroupRef | null>();
  const [selectedUser, setSelectedUser] = useState<AuthUserRef | null>();
  const [dashboardsChanged, setDashboardsChanged] = useState<
    AuthGroupDashboardRef[]
  >([]);
  const [selectedDashboard, setSelectedDashboard] =
    useState<Dashboard | null>();
  const [groupsChanged, setGroupsChanged] = useState<AuthGroupRef[]>([]);
  const [dashboards, setDashboards] = useState<any[]>([]);
  const [users, setUsers] = useState<AuthUserRef[]>([]);
  const navigate = useNavigate();
  const [totalGroups, setTotalGroups] = useState<number>();
  const [totalUsers, setTotalUsers] = useState<number>();
  const [totalDashboards, setTotalDashboards] = useState<number>();
  const [addDashboard, setAddDashboard] = useState(false);
  const [addUsers, setAddUsers] = useState(false);
  const [newDashboards, setNewDashboards] = useState<AuthGroupDashboardRef[]>(
    [],
  );
  const [newUsers, setNewUsers] = useState<AuthUserRef[]>([]);
  const [dashboardsToBeDeleted, setDashboardstoBeDeleted] =
    useState<string[]>();
  const notificationManagerRef = useRef<MessageRefs>();
  const [isLoading1, setIsLoading1] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [isLoading3, setIsLoading3] = useState(false);

  const fetchAuthGroups = async () => {
    setIsLoading1(true);
    const res = await readAuthGroups({ from: 1, to: 100, filters: {} });

    if (res?.status === 404) {
      setAuthGroups([]);
      setTotalGroups(0);
      setIsLoading1(false);
      return;
    } else if (res?.status === 500) {
      notificationManagerRef?.current?.addMessage(
        'error',
        'Error',
        'Something went wrong. Could not fetch Auth Group(s)!',
      );
      setAuthGroups([]);
      setTotalGroups(0);
      setIsLoading1(false);
      return;
    }
    const authGroups = res?.data.authGroups;

    authGroups && setAuthGroups(authGroups);
    setTotalGroups(res?.data.totalGroups);
    setIsLoading1(false);
  };

  const updateGroups = async () => {
    if (groupsChanged.length === 0) return;
    const fails = [];

    for (const [index, group] of groupsChanged.entries()) {
      const res = await updateAuthGroups({ id: group.id, name: group.name });

      if (res.status !== 200) {
        notificationManagerRef?.current?.addMessage(
          'error',
          'Error',
          `Something went wrong. Could not update Auth Group to ${group.name}.`,
        );
        fails.push(res.status);
      }

      if (index === groupsChanged.length - 1 && fails.length === 0) {
        notificationManagerRef?.current?.addMessage(
          'success',
          'Success',
          `Auth Group(s) updated.`,
        );
      }
    }
  };

  const fetchAuthGroupDashboards = async () => {
    if (!selectedGroup?.id) return;
    setIsLoading2(true);
    const res = await readAuthGroupsDashboards({
      id: selectedGroup.id,
      filters: filtersDashboards,
      from: fromDashboards || 1,
      to: toDashboards || 1,
    });

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

    const dashboards = res?.data.dashboards;
    const totalCount = res?.data.count;

    dashboards && setDashboards(dashboards);
    totalCount && setTotalDashboards(totalCount);
    setIsLoading2(false);
  };

  const fetchAuthGroupUsers = async () => {
    if (!selectedGroup?.id) return;
    setIsLoading3(true);

    console.log({
      id: selectedGroup.id,
      filters: filtersUsers,
      from: fromUsers,
      to: toUsers,
    });
    const res = await readAuthGroupsUsers({
      id: selectedGroup.id,
      filters: filtersUsers || 1,
      from: fromUsers || 1,
      to: toUsers || 1,
    });

    if (res?.status === 404) {
      setUsers([]);
      setTotalUsers(0);
    } else if (res?.status === 500) {
      notificationManagerRef?.current?.addMessage(
        'error',
        'Error',
        'Something went wrong. Could not fetch Dashboard(s)!',
      );
    } else {
      const authUsers = res?.data.authUsers;
      const totalCount = res?.data.count;

      authUsers && setUsers(authUsers);
      totalCount && setTotalUsers(totalCount);
    }
    setIsLoading3(false);
  };

  const updateAuthGroupDash = async () => {
    if (!selectedGroup?.id || !dashboardsChanged) return;

    const res = await updateAuthGroupDashboards({
      id: selectedGroup.id,
      dashboards: dashboardsChanged,
    });

    if (res?.status === 200) {
      notificationManagerRef?.current?.addMessage(
        'success',
        'Success',
        'Dashboard(s) updated!',
      );

      await fetchAuthGroupDashboards();
    } else {
      notificationManagerRef?.current?.addMessage(
        'error',
        'Error',
        'Something went wrong. Could not update Dashboard(s)!',
      );
    }
  };

  // useEffect(() => {
  //   fetchAuthGroupDashboards();
  //   fetchAuthGroupUsers();
  // }, [selectedGroup]);

  useEffect(() => {
    fetchAuthGroupDashboards();
  }, [toDashboards, fromDashboards, filtersDashboards]);

  useEffect(() => {
    fetchAuthGroupUsers();
  }, [toUsers, fromUsers, filtersUsers]);

  useEffect(() => {
    fetchAuthGroups();
  }, [filters, to, from]);

  const handleParamsChange = (params: IGetRowsParams) => {
    setFilters(params.filterModel);
    setFrom(params.startRow + 1);
    setTo(params.endRow);
  };

  const addAuthGroupDashboard = async () => {
    if (!selectedGroup?.id || !selectedGroup.name) return;
    const res = await createAuthGroupDashboards({
      name: selectedGroup.name,
      id: selectedGroup?.id,
      dashboards: newDashboards.map((dashboard) => {
        return {
          name: dashboard.name,
          id: dashboard.id,
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
        `Dashboard(s) added to ${selectedGroup.name}`,
      );

      await fetchAuthGroupDashboards();
    } else {
      notificationManagerRef?.current?.addMessage(
        'error',
        'Error',
        'Something went wrong. Could not add Dashboard!',
      );
    }
  };

  const addAuthGroupUser = async () => {
    if (!selectedGroup?.id || !selectedGroup.name) return;
    console.log({
      name: selectedGroup.name,
      id: selectedGroup?.id,
      authUsers: newUsers.map((user) => {
        return {
          name: user.name,
          id: user.id,
        };
      }),
    });

    const res = await createAuthGroupUsers({
      name: selectedGroup.name,
      id: selectedGroup?.id,
      authUsers: newUsers.map((user) => {
        return {
          name: user.name,
          id: user.id,
        };
      }),
    });

    if (res?.status === 200) {
      notificationManagerRef?.current?.addMessage(
        'success',
        'Success',
        `User(s) added to ${selectedGroup.name}`,
      );

      await fetchAuthGroupUsers();
    } else {
      notificationManagerRef?.current?.addMessage(
        'error',
        'Error',
        'Something went wrong. Could not add User!',
      );
    }
  };

  const deleteDashboardsAuthGroup = async (data: DashboardAuthGroups[]) => {
    if (!selectedGroup?.id) return;
    const ids = data.map((el) => el.groupId);

    const res = await deleteDashboardGroupAuth({
      authGroups: ids,
      dashboardId: selectedGroup?.id,
    });

    if (res?.status === 200) {
      notificationManagerRef?.current?.addMessage(
        'success',
        'Success',
        'Auth Group(s) deleted!',
      );
      await fetchAuthGroupDashboards();
    } else {
      notificationManagerRef?.current?.addMessage(
        'error',
        'Error',
        'Something wrong happened! Could not delete.',
      );
    }
  };

  const handleGroupDashboardsDelete = async (arr: AuthGroupDashboardRef[]) => {
    if (!selectedGroup?.id) return;
    const res = await deleteAuthGroupDashboards({
      id: selectedGroup?.id,
      dashboardIds: arr.map((el) => el.id),
    });

    if (res?.status === 200) {
      notificationManagerRef?.current?.addMessage(
        'success',
        'Success',
        `Dashboards disassociated to ${selectedGroup?.name}!`,
      );
      await fetchAuthGroupDashboards();
    } else {
      notificationManagerRef?.current?.addMessage(
        'error',
        'Error',
        `Could not disassociate dashboard(s) from ${selectedGroup?.name}!`,
      );
    }

    fetchAuthGroups();
  };

  const handleGroupUsersDelete = async (arr: AuthGroupDashboardRef[]) => {
    if (!selectedGroup?.id) return;
    console.log({
      id: selectedGroup?.id,
      authUsersIds: arr.map((el) => el.id),
    });
    const res = await deleteAuthGroupUsers({
      id: selectedGroup?.id,
      authUsersIds: arr.map((el) => el.id),
    });
    console.log({
      id: selectedGroup?.id,
      authUsersIds: arr.map((el) => el.id),
    });

    if (res?.status === 200) {
      notificationManagerRef?.current?.addMessage(
        'success',
        'Success',
        `User(s) disassociated to ${selectedGroup?.name}!`,
      );
      await fetchAuthGroupUsers();
    } else {
      notificationManagerRef?.current?.addMessage(
        'error',
        'Error',
        `Could not disassociate user(s) from ${selectedGroup?.name}!`,
      );
    }

    fetchAuthGroups();
  };

  const handleCellClicked = (e: CellClickedEvent<any, any>) => {
    console.log({ e });
    if (e.colDef.field !== 'click') return;
    setSelectedGroup(null);
    setTimeout(() => {
      setSelectedGroup(e.data);
    }, 1);
  };

  useEffect(() => {
    console.log({ totalUsers, users });
  }, [users, totalUsers]);

  const handleGroupDashboards = (data: IGetRowsParams) => {
    setFromDashboards(data.startRow);
    setToDashboards(data.endRow);
    setFiltersDashboards(data.filterModel);
  };

  const handleGroupGroups = (data: IGetRowsParams) => {
    setFromUsers(data.startRow);
    setToUsers(data.endRow);
    setFiltersUsers(data.filterModel);
  };

  return (
    <div className={styles.dashboardAuthGroupsView}>
      {(addDashboard || addUsers) && (
        <div
          className={styles.dashboardAuthGroupsViewShadow}
          onClick={() => {
            setAddDashboard(false);
            setAddUsers(false);
          }}
        ></div>
      )}

      <div className={styles.dashboardAuthGroupsViewContainer}>
        {
          <div className={styles.authGroupsGrid}>
            <AuthGroups
              onCellClicked={handleCellClicked}
              onRefresh={() => fetchAuthGroups()}
              onDelete={(e) => deleteDashboardsAuthGroup(e)}
              permissions={{
                createAction: true,
                deleteAction: true,
                updateAction: true,
              }}
              onParamsChange={handleParamsChange}
              isLoading={isLoading1}
              selectRowByCell={true}
              onRowsStateChange={(e) => {
                setAddMode(false);
                setGroupsChanged(e as AuthGroupRef[]);
              }}
            />
            {groupsChanged.length > 0 && !addMode && (
              <button onClick={() => updateGroups()}>
                Update AuthGroup(s)
              </button>
            )}
          </div>
        }
        {selectedGroup && (
          <>
            <label htmlFor="">{selectedGroup?.name} Dashboards:</label>
            <PVGridWebiny2
              add={() => setAddDashboard(true)}
              cols={cols}
              cypressAtt="group-dashboards-grid"
              rows={dashboards}
              isLoading={isLoading2}
              permissions={{
                createAction: true,
                deleteAction: true,
                updateAction: true,
              }}
              onRowsStateChange={(e) => {
                setDashboardsChanged(e as AuthGroupDashboardRef[]);
              }}
              onParamsChange={handleGroupDashboards}
              updateModeOnRows={true}
              totalCount={totalDashboards}
              onUpdate={updateAuthGroupDash}
              onRowsSelected={(e) => {
                setDashboardstoBeDeleted(e.map((el) => el.data.id));
              }}
              onRefresh={() => fetchAuthGroupDashboards()}
              onDelete={handleGroupDashboardsDelete}
            />
          </>
        )}
        {selectedGroup && (
          <>
            <label htmlFor="">{selectedGroup?.name} Users:</label>
            <PVGridWebiny2
              add={() => setAddUsers(true)}
              cols={[
                {
                  headerName: 'Name',
                  field: 'name',
                  sortable: true,

                  filter: true,
                  // cellEditor: SimpleTextEditor,
                },
                {
                  headerName: 'Id',
                  field: 'id',
                  sortable: true,
                  filter: true,
                },
              ]}
              cypressAtt="group-users-grid"
              rows={users}
              isLoading={isLoading3}
              permissions={{
                createAction: true,
                deleteAction: true,
                updateAction: true,
              }}
              onRowsStateChange={(e) => {
                setDashboardsChanged(e as AuthGroupDashboardRef[]);
              }}
              onParamsChange={handleGroupGroups}
              updateModeOnRows={true}
              totalCount={totalUsers}
              onUpdate={updateAuthGroupDash}
              onRowsSelected={(e) => {
                setDashboardstoBeDeleted(e.map((el) => el.data.id));
              }}
              onRefresh={() => fetchAuthGroupUsers()}
              onDelete={handleGroupUsersDelete}
            />
          </>
        )}
        {addDashboard && (
          <div className={styles.selectGroup}>
            <FetchDashboards
              selection={true}
              dashboardsToFilterOutById={dashboards}
              onRowsSelected={(e) => setNewDashboards(e.map((el) => el.data))}
            />
            {newDashboards.length > 0 && (
              <button onClick={() => addAuthGroupDashboard()}>
                Add Group(s)
              </button>
            )}
          </div>
        )}
        {addUsers && (
          <div className={styles.selectGroup}>
            <AuthUsersGrid
              selection={true}
              usersToFilterOutById={users}
              onRowsSelected={(e) => setNewUsers(e.map((el) => el.data))}
            />
            {newUsers.length > 0 && (
              <button onClick={() => addAuthGroupUser()}>Add User(s)</button>
            )}
          </div>
        )}
      </div>
      <NotificationManager ref={notificationManagerRef} />
    </div>
  );
};

export default DashboardAuthGroupsView;
