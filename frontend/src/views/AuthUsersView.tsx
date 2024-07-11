import { useEffect, useRef, useState } from 'react';
import {
  createAuthGroup,
  createAuthGroupDashboards,
  createDashboard,
  createDashboardGroupAuth,
  createUserGroups,
  deleteAuthGroupDashboards,
  deleteDashboard,
  deleteDashboardGroupAuth,
  deleteUser,
  deleteUserGroups,
  getAllDashboards,
  readAuthGroupsDashboards as readAuthUserGroups,
  readDashboardGroupAuth,
  readUserGroups,
  readUsers,
  updateAuthGroupDashboards,
  updateAuthGroups,
  updateDashboardGroupAuth,
  updateUser,
} from '../client';
import {
  AuthGroupDashboardRef,
  AuthGroupRef,
  AuthUserAndGroupsRef,
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
import { AuthUserGroupRef } from '../typescript/api/resources/pontus/types/AuthUserGroupRef';
import AuthUsersGrid from '../components/AuthUsersGrid';
import { AuthUserRef } from '../typescript/api/resources/pontus/types/AuthUserRef';

const AuthUsersView = () => {
  const [users, setAuthUsers] = useState<AuthGroupRef[]>([]);
  const [from, setFrom] = useState<number>();
  const [to, setTo] = useState<number>();
  const [filters, setFilters] = useState<{
    [key: string]: ReadPaginationFilterFilters;
  }>({
    groupName: { filter: '', filterType: 'text', type: 'contains' },
  });
  const [cols, setCols] = useState<ColDef[]>([
    {
      headerName: 'Username',
      field: 'username',
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

  const [addMode, setAddMode] = useState(false);

  const [selectedUser, setSelectedUser] = useState<AuthGroupRef | null>();
  const [groupsChanged, setGroupsChanged] = useState<AuthUserGroupRef[]>([]);
  const [selectedDashboard, setSelectedDashboard] =
    useState<Dashboard | null>();
  const [usersChanged, setUsersChanged] = useState<AuthGroupRef[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const navigate = useNavigate();
  const [totalGroups, setTotalGroups] = useState<number>();

  const [addDashboard, setAddDashboard] = useState(false);
  const [newGroups, setNewGroups] = useState<AuthUserAndGroupsRef[]>([]);
  const [userGroupsToBeDeleted, setUserGroupsToBeDeleted] =
    useState<string[]>();
  const notificationManagerRef = useRef<MessageRefs>();
  const [isLoading1, setIsLoading1] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);

  const fetchAuthGroups = async () => {
    setIsLoading1(true);
    const res = await readUsers({ from: 1, to: 100, filters: {} });
    const authUsers = res?.data.authUsers;

    if (res?.status === 404) {
      setAuthUsers([]);
      setTotalGroups(0);
      setIsLoading1(false);
      return;
    } else if (res?.status === 500) {
      notificationManagerRef?.current?.addMessage(
        'error',
        'Error',
        'Something went wrong. Could not fetch Auth Group(s)!',
      );
      setAuthUsers([]);
      setTotalGroups(0);
      setIsLoading1(false);
      return;
    }

    authUsers && setAuthUsers(authUsers);
    setTotalGroups(res?.data.count);
    setIsLoading1(false);
  };

  const updateGroups = async () => {
    if (groupsChanged.length === 0) return;
    const fails = [];

    for (const [index, group] of groupsChanged.entries()) {
      const res = await updateUser({ id: group.id, name: group.name });

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

  const fetchAuthUserGroups = async () => {
    if (!selectedUser?.id) return;
    setIsLoading2(true);
    const res = await readUserGroups({
      id: selectedUser.id,
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
        'Something went wrong. Could not fetch Dashboard(s)!',
      );
    }

    const authGroups = res?.data.authGroups;
    const totalCount = res?.data.count;

    authGroups && setGroups(authGroups);
    totalCount && setTotalGroups(totalCount);
    setIsLoading2(false);
  };

  useEffect(() => {
    fetchAuthUserGroups();
  }, [selectedUser, filters, to, from]);

  useEffect(() => {
    fetchAuthGroups();
  }, []);

  const handleParamsChange = (params: IGetRowsParams) => {
    setFilters(params.filterModel);
    setFrom(params.startRow + 1);
    setTo(params.endRow);
  };

  const addAuthUserGroup = async () => {
    if (!selectedUser?.id || !selectedUser.name) return;
    const res = await createUserGroups({
      id: selectedUser?.id,
      authGroupsIds: newGroups.map((group) => group.id),
    });

    if (res?.status === 200) {
      notificationManagerRef?.current?.addMessage(
        'success',
        'Success',
        `Dashboard(s) added to ${selectedUser.name}`,
      );

      await fetchAuthUserGroups();
    } else {
      notificationManagerRef?.current?.addMessage(
        'error',
        'Error',
        'Something went wrong. Could not add Dashboard!',
      );
    }
  };

  const deleteAuthUsers = async (data: AuthUserRef[]) => {
    if (!selectedUser?.id) return;

    for (const [index, user] of data.entries()) {
      const res = await deleteUser({
        id: user?.id,
      });

      if (index === data.length - 1) {
        if (res?.status === 200) {
          notificationManagerRef?.current?.addMessage(
            'success',
            'Success',
            'Auth Group(s) deleted!',
          );
          await fetchAuthUserGroups();
        } else {
          notificationManagerRef?.current?.addMessage(
            'error',
            'Error',
            'Something wrong happened! Could not delete.',
          );
        }
      }
    }
  };

  const deleteAuthUserGroups = async (arr: AuthUserAndGroupsRef[]) => {
    if (!selectedUser?.id) return;
    const res = await deleteUserGroups({
      id: selectedUser?.id,
      authGroupsIds: arr?.map((el) => el.id),
    });

    if (res?.status === 200) {
      notificationManagerRef?.current?.addMessage(
        'success',
        'Success',
        `Dashboards disassociated to ${selectedUser?.name}!`,
      );
      await fetchAuthUserGroups();
    } else {
      notificationManagerRef?.current?.addMessage(
        'error',
        'Error',
        `Could not disassociate dashboard(s) from ${selectedUser?.name}!`,
      );
    }

    fetchAuthGroups();
  };

  const handleCellClicked = (e: CellClickedEvent<any, any>) => {
    if (e.colDef.field !== 'click') return;
    setSelectedUser(null);
    setTimeout(() => {
      setSelectedUser(e.data);
    }, 1);
  };

  return (
    <div className={styles.dashboardAuthGroupsView}>
      {addDashboard && (
        <div
          className={styles.dashboardAuthGroupsViewShadow}
          onClick={() => setAddDashboard(false)}
        ></div>
      )}

      <div className={styles.dashboardAuthGroupsViewContainer}>
        {
          <div className={styles.authGroupsGrid}>
            <AuthUsersGrid
              onCellClicked={handleCellClicked}
              onRefresh={() => fetchAuthGroups()}
              onDelete={(e) => deleteAuthUsers(e)}
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
                setGroupsChanged(e as AuthUserRef[]);
              }}
            />
            {groupsChanged.length > 0 && !addMode && (
              <button onClick={() => updateGroups()}>
                Update AuthGroup(s)
              </button>
            )}
          </div>
        }
        {selectedUser && (
          <>
            <label htmlFor="">{selectedUser?.name} Auth Groups:</label>
            <PVGridWebiny2
              add={() => setAddDashboard(true)}
              cols={cols}
              cypressAtt="user-groups-grid"
              rows={groups}
              isLoading={isLoading2}
              permissions={{
                createAction: true,
                deleteAction: true,
                updateAction: true,
              }}
              onRowsStateChange={(e) => {
                setGroupsChanged(e as AuthGroupDashboardRef[]);
              }}
              updateModeOnRows={true}
              totalCount={totalGroups}
              // onUpdate={updateAuthGroupDash}
              onRowsSelected={(e) => {
                setUserGroupsToBeDeleted(e.map((el) => el.data.id));
              }}
              onRefresh={() => fetchAuthUserGroups()}
              onDelete={deleteAuthUserGroups}
            />
            {/* <AuthGroups /> */}
          </>
        )}
        {addDashboard && (
          <div className={styles.selectGroup}>
            <AuthGroups
              selection={true}
              groupsToFilterOutById={groups}
              onRowsSelected={(e) => setNewGroups(e.map((el) => el.data))}
            />
            {newGroups.length > 0 && (
              <button onClick={() => addAuthUserGroup()}>Add Group(s)</button>
            )}
          </div>
        )}
      </div>
      <NotificationManager ref={notificationManagerRef} />
    </div>
  );
};

export default AuthUsersView;
