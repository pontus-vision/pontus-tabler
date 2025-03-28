import { useEffect, useRef, useState } from 'react';
import {
  createAuthGroup,
  deleteAuthGroup,
  readAuthGroups,
  updateAuthGroups,
} from '../client';
import {
  AuthGroupDeleteReq,
  AuthGroupDeleteRes,
  AuthGroupRef,
  AuthGroupUpdateReq,
  AuthGroupUpdateRes,
  AuthUserDeleteReq,
  AuthUserIdAndUsername,
  AuthUserUpdateReq,
  AuthUserUpdateRes,
  AuthUsersReadReq,
  AuthUsersReadRes,
  ReadPaginationFilterFilters,
} from '../typescript/api';
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
import useApiAndNavigate from '../hooks/useApi';
import { AxiosResponse } from 'axios';
import { useTranslation } from 'react-i18next';

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
  usersToFilterOutById?: AuthUserIdAndUsername[];
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
  const { t } = useTranslation()
  const [totalUsers, setTotalUsers] = useState<number>();
  const [isLoading1, setIsLoading1] = useState(false);
  const [users, setUsers] = useState<AuthUserIdAndUsername[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<AuthGroupRef | null>();
  const notificationManagerRef = useRef<MessageRefs>();
  const [addMode, setAddMode] = useState(false);
  const [updateMode, setUpdateMode] = useState(false);
  const [usersChanged, setUsersChanged] = useState<AuthGroupRef[]>([]);
  const [usersToBeUpdated, setUsersToBeUpdated] = useState<AuthGroupRef[]>([]);
  const [usersToBeAdded, setUsersToBeAdded] = useState<AuthGroupRef | null>();
  const [from, setFrom] = useState<number>(1);
  const [to, setTo] = useState<number>(100);
  const [filters, setFilters] = useState<{
    [key: string]: ReadPaginationFilterFilters;
  }>();
  const { fetchDataAndNavigate } = useApiAndNavigate();

  const [reset, setReset] = useState(false);

  const fetchAuthUsers = async () => {
    setIsLoading1(true);

    const req: AuthUsersReadReq = { from, to, filters };

    try {
      const res = (await fetchDataAndNavigate(
        readUsers,
        req,
      )) as AxiosResponse<AuthUsersReadRes>;

      const authUsers = res?.data.authUsers;
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
    } catch (error) {

      if (error?.status === 404) {
        setUsers([]);
        setTotalUsers(0);
        setIsLoading1(false);
        return;
      } else if (error?.status === 500) {
        notificationManagerRef?.current?.addMessage(
          'error',
          t('Error'),
          `${t('Something went wrong. Could not fetch')} ${t('Auth User(s)')}!`,
        );
        setUsers([]);
        setTotalUsers(0);
        setIsLoading1(false);
        return;
      }
    }
  };

  const delAuthUsers = async (arr: AuthUserRef[]) => {
    for (const [index, user] of arr.entries()) {
      const req: AuthUserDeleteReq = { id: user.id, username: user.username };

      const res = (await fetchDataAndNavigate(
        deleteAuthGroup,
        req,
      )) as AxiosResponse<AuthGroupDeleteRes>;

      if (index === arr.length - 1) {
        if (res?.status === 200) {
          notificationManagerRef?.current?.addMessage(
            'success',
            t('Success'),
            t('Auth User(s) deleted!'),
          );
          await fetchAuthUsers();
        } else {
          notificationManagerRef?.current?.addMessage(
            'error',
            t('Error'),
            t("Something went wrong. Could not delete"),
          );
        }
      }
    }
  };

  const resetRowsState = () => {
    setReset(true);
    setTimeout(() => {
      setReset(false);
    }, 1);
  };

  const updateUsers = async () => {
    if (usersChanged.length === 0) return;
    const fails = [];

    for (const [index, user] of usersChanged.entries()) {
      if (!user.id) break;

      const req: AuthUserUpdateReq = { id: user.id, username: user.name };

      const res = (await fetchDataAndNavigate(
        updateAuthGroups,
        req,
      )) as AxiosResponse<AuthUserUpdateRes>;

      if (res.status !== 200) {
        notificationManagerRef?.current?.addMessage(
          'error',
          t('Error'),
          `${t("Something went wrong. Could not update Auth User to ")}${user.name}.`,
        );
        fails.push(res.status);
      }

      if (index === usersToBeUpdated.length - 1 && fails.length === 0) {
        notificationManagerRef?.current?.addMessage(
          'success',
          t('Success'),
          t(`Auth User(s) updated`),
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
    setUsers([...users, { username: '', id: '' }]);
  };

  const handleRowsStateChange = (e: Record<string, any>[]) => {
    if (onRowsStateChange) {
      return onRowsStateChange(e)
    }
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
  }, [filters, from, to]);

  const handleParamsChange = (params: IGetRowsParams) => {
    setFilters(params.filterModel);
    setFrom(params.startRow + 1);
    setTo(params.endRow);
  };

  return (
    <>
      <PVGridWebiny2
        onCellClicked={onCellClicked}
        //onCreateRow={e => console.log({ e })}
        cypressAtt="auth-groups-grid"
        onRefresh={() => fetchAuthUsers()}
        add={() => handleOnAdd()}
        onDelete={(e) => delAuthUsers(e)}
        permissions={permissions}
        selection={selection}
        onParamsChange={handleParamsChange}
        isLoading={isLoading1}
        onRowsSelected={onRowsSelected}
        updateModeOnRows={true}
        onUpdate={updateUsers}
        resetRowsChangedState={reset}
        // onCellValueChange={(e) => addUser(e.data)}
        onCellsChange={(e) => handleOnCellsChange(e)}
        selectRowByCell={selectRowByCell}
        onRowsStateChange={(e) => handleRowsStateChange(e)}
        cols={[
          {
            headerName: t('Username'),
            field: 'username',
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
