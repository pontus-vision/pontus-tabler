import { useEffect, useRef, useState } from 'react';
import {
  createAuthGroup,
  deleteAuthGroup,
  readAuthGroups,
  updateAuthGroups,
} from '../client';
import { AuthGroupRef } from '../typescript/api';
import NotificationManager, {
  MessageRefs,
} from '../components/NotificationManager';
import PVGridWebiny2 from '../pv-react/PVGridWebiny2';
import {
  CellClickedEvent,
  CellValueChangedEvent,
  IGetRowsParams,
  IRowNode,
} from 'ag-grid-community';
import { AuthUserRef } from '../typescript/api/resources/pontus/types/AuthUserRef';
import { readUsers } from '../client';

type Props = {
  onCellClicked?: (e: CellClickedEvent<any, any>) => void;
  onRefresh?: () => void;
  onAdd?: () => void;
  onDelete?: (arr: any[]) => void;
  onUpdate?: (data: any) => void;
  permissions?: {
    updateAction?: boolean;
    createAction?: boolean;
    deleteAction?: boolean;
    readAction?: boolean;
  };
  usersToFilterOutById?: AuthUserRef[];
  onRowsSelected?: (e: IRowNode<any>[]) => void;
  selection?: boolean;
  selectRowByCell?: boolean;
  onParamsChange?: (params: IGetRowsParams) => void;
  isLoading?: boolean;
  onRowsStateChange?: (data: Record<string, any>[]) => void;
  onCellsChange?: (data: CellValueChangedEvent[]) => void;
};

const AuthUsersGrid = ({
  isLoading,
  onAdd,
  onCellClicked,
  onCellsChange,
  onDelete,
  onParamsChange,
  onRefresh,
  onRowsStateChange,
  onUpdate,
  selection,
  permissions,
  selectRowByCell,
  onRowsSelected,
  usersToFilterOutById,
}: Props) => {
  const [totalUsers, setTotalUsers] = useState<number>();
  const [isLoading1, setIsLoading1] = useState(false);
  const [users, setUsers] = useState<AuthUserRef[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<AuthGroupRef | null>();
  const notificationManagerRef = useRef<MessageRefs>();
  const [addMode, setAddMode] = useState(false);
  const [updateMode, setUpdateMode] = useState(false);
  const [usersChanged, setUsersChanged] = useState<AuthGroupRef[]>([]);
  const [usersToBeUpdated, setUsersToBeUpdated] = useState<AuthGroupRef[]>([]);
  const [usersToBeAdded, setUsersToBeAdded] = useState<AuthGroupRef | null>();

  const [reset, setReset] = useState(false);

  const fetchAuthUsers = async () => {
    setIsLoading1(true);
    const res = await readUsers({ from: 1, to: 100, filters: {} });

    const authUsers = res?.data.authUsers;

    if (res?.status === 404) {
      setUsers([]);
      setTotalUsers(0);
      setIsLoading1(false);
      return;
    } else if (res?.status === 500) {
      notificationManagerRef?.current?.addMessage(
        'error',
        'Error',
        'Something went wrong. Could not fetch Auth Group(s)!',
      );
      setUsers([]);
      setTotalUsers(0);
      setIsLoading1(false);
      return;
    }

    if (usersToFilterOutById) {
      const filtered = res?.data.authUsers?.filter(
        (dash1) => !usersToFilterOutById.some((dash2) => dash1.id === dash2.id),
      );

      filtered && setUsers(filtered);
      setTotalUsers(filtered?.length);
    } else {
      authUsers && setUsers(authUsers);
      setTotalUsers(res?.data.count);
    }
    setIsLoading1(false);
  };

  const delAuthUsers = async (arr: AuthUserRef[]) => {
    for (const [index, user] of arr.entries()) {
      const res = await deleteAuthGroup({ id: user.id });

      if (index === arr.length - 1) {
        if (res?.status === 200) {
          notificationManagerRef?.current?.addMessage(
            'success',
            'Success',
            'Auth Group(s) deleted!',
          );
          await fetchAuthUsers();
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

  const addUser = async (data: AuthUserRef) => {
    if (!addMode || data.id) return;

    const res = await createAuthGroup({ name: data.name });

    if (res?.status === 200) {
      notificationManagerRef?.current?.addMessage(
        'success',
        'Success',
        `AuthGroup(s) created!`,
      );

      await fetchAuthUsers();
    } else {
      notificationManagerRef?.current?.addMessage(
        'error',
        'Error',
        'Something went wrong. Could not create Auth Group(s)!',
      );
    }

    setUsersToBeAdded(null);
    // setGroupsChanged(groupsChanged.filter((group) => !!group.id));
    // console.log({ groupsChanged });
    resetRowsState();
    setUsersChanged([]);
    setAddMode(false);
  };

  const resetRowsState = () => {
    setReset(true);
    setTimeout(() => {
      setReset(false);
    }, 1);
  };

  const updateGroups = async () => {
    console.log({ groupsChanged: usersChanged });
    if (usersChanged.length === 0) return;
    const fails = [];

    for (const [index, group] of usersChanged.entries()) {
      if (!group.id) break;
      const res = await updateAuthGroups({ id: group.id, name: group.name });

      if (res.status !== 200) {
        notificationManagerRef?.current?.addMessage(
          'error',
          'Error',
          `Something went wrong. Could not update Auth Group to ${group.name}.`,
        );
        fails.push(res.status);
      }

      if (index === usersToBeUpdated.length - 1 && fails.length === 0) {
        notificationManagerRef?.current?.addMessage(
          'success',
          'Success',
          `Auth Group(s) updated.`,
        );
      }
    }
    resetRowsState();
    setUsersChanged([]);
    setUsersChanged([]);
    setUsersToBeUpdated([]);

    setUpdateMode(false);
  };

  const handleOnCellsChange = (e: CellValueChangedEvent<any, any>[]) => {
    if (onCellsChange) {
      return onCellsChange;
    }
  };

  const handleOnAdd = () => {
    if (onAdd) {
      return onAdd;
    }

    setAddMode(true);
    setTotalUsers((totalUsers || 0) + 1);
    setUsers([...users, { name: '', id: '' }]);
  };

  const handleRowsStateChange = (e: Record<string, any>[]) => {
    // if(authGroups.some(group=> ))
    setUsersChanged(e as AuthGroupRef[]);

    // if (e.some((el) => !el.id)) {
    //   setAddMode(true);
    // } else {
    //   setUpdateMode(true);
    // }

    // if (addMode) {
    //   setGroupsToBeAdded(e[e.length - 1] as AuthGroupRef);
    // }
  };

  useEffect(() => {
    if (!usersChanged[usersChanged.length - 1]?.id) {
      setAddMode(true);
      setUpdateMode(false);
    } else {
      setAddMode(false);
      setUpdateMode(true);
    }
    if (addMode) {
      setUsersToBeAdded(usersChanged[usersChanged.length - 1] as AuthGroupRef);
    }
    setUsersToBeUpdated(usersChanged.filter((group) => group.id));
  }, [usersChanged]);

  useEffect(() => {
    fetchAuthUsers();
  }, []);

  useEffect(() => {
    // groupsToBeAdded && addGroup(groupsToBeAdded);
  }, [usersToBeAdded]);

  return (
    <>
      <PVGridWebiny2
        onCellClicked={onCellClicked}
        cypressAtt="auth-groups-grid"
        onRefresh={() => fetchAuthUsers()}
        add={() => handleOnAdd()}
        onDelete={(e) => delAuthUsers(e)}
        permissions={permissions}
        selection={selection}
        onParamsChange={onParamsChange}
        isLoading={isLoading1}
        onRowsSelected={onRowsSelected}
        updateModeOnRows={true}
        onUpdate={updateGroups}
        resetRowsChangedState={reset}
        onCellValueChange={(e) => addUser(e.data)}
        onCellsChange={(e) => handleOnCellsChange(e)}
        selectRowByCell={selectRowByCell}
        onRowsStateChange={(e) => handleRowsStateChange(e)}
        cols={[
          {
            headerName: 'Name',
            field: 'name',
            sortable: true,

            filter: true,
            editable: permissions?.updateAction,
            // cellEditor: SimpleTextEditor,
          },
          {
            headerName: 'Id',
            field: 'id',
            sortable: true,
            filter: true,
          },
        ]}
        rows={users}
        totalCount={totalUsers}
      />

      <NotificationManager ref={notificationManagerRef} />
    </>
  );
};

export default AuthUsersGrid;
