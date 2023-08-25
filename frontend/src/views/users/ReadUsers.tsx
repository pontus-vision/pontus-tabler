import { useEffect, useState } from 'react';
import PVGridWebiny2 from '../../pv-react/PVGridWebiny2';
import { createUser, deleteUser, readUsers, updateUser } from '../../client';
import {
  ReadPaginationFilter2Filters,
  ReadPaginationFilterFilters,
  UpdateUser,
  User,
} from '../../pontus-api/typescript-fetch-client-generated';
import { ColDef, RowEvent } from 'ag-grid-community';
import GridActionsPanel from '../../components/GridActionsPanel';
import Alert from 'react-bootstrap/esm/Alert';
import { useTranslation } from 'react-i18next';
import { redirect, useNavigate } from 'react-router-dom';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';

const ReadUsers = () => {
  const [cols, setCols] = useState<ColDef[]>([
    {
      headerName: 'Name',
      field: 'name',
      sortable: true,
      filter: true,
    },
    {
      headerName: 'Auth Groups',
      field: 'authGroups',
      sortable: true,
      filter: true,
    },
    {
      headerName: 'User ID',
      field: 'userId',
      sortable: true,
      filter: true,
    },
  ]);

  const [rows, setRows] = useState<{ [key: string]: unknown }[]>();
  const [filters, setFilters] = useState<ReadPaginationFilter2Filters>();
  const [from, setFrom] = useState<number>();
  const [to, setTo] = useState<number>();
  const [totalCount, setTotalCount] = useState<number>();
  const [rowClicked, setRowClicked] = useState<RowEvent>();
  const [deleteMode, setDeleteMode] = useState(false);
  const [deletion, setDeletion] = useState(false);
  const [entriesToBeDeleted, setEntriesToBeDeleted] = useState<User[]>([]);
  const [successMsg, setSuccessMsg] = useState<string>();
  const [openModalAddUsers, setOpenModalAddUsers] = useState(false);
  const navigate = useNavigate();

  const { t } = useTranslation();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await readUsers({
          filters,
          from,
          to,
        });

        const users = res?.data.users;

        console.log(res);

        if (!users) throw new Error('Users undefined');
        setTotalCount(res.data.totalUsers);

        setRows(
          users.map((user) => {
            return { ...user, authGroups: user.authGroups?.join(', ') };
          }),
        );
      } catch (error) {
        console.error(error);
      }
    };
    ``;
    fetchUsers();
  }, [filters, from, to]);

  useEffect(() => {
    if (entriesToBeDeleted.length > 0 === false) {
      setDeletion(false);
    }
  }, [deletion]);

  const deleteUsers = () => {
    entriesToBeDeleted?.forEach(async (entry) => {
      try {
        const res = entry.userId && (await deleteUser(entry.userId));

        console.log(res);
        // setSuccessMsg(t('Row(s) deleted'));
      } catch (error) {
        console.error(error);
      }
    });
  };

  // const postNewUser = async () => {
  //   const data = await createUser();
  // };

  const handleModalOpen = () => {
    navigate('/user/create');
  };

  const handleCloseDeleteModal = () => {
    setDeletion(false);
  };

  const handleUpdate = (data: UpdateUser) => {
    navigate('/user/update/' + data.userId, { state: data });
  };

  if (!cols || !rows) return;

  return (
    <div className="w-5/6 m-auto flex flex-col h-full justify-center">
      {entriesToBeDeleted?.length > 0 && (
        <DeleteConfirmationModal
          onDelete={deleteUsers}
          onClose={handleCloseDeleteModal}
          isOpen={deletion}
        />
      )}
      <div className="shadow">
        <PVGridWebiny2
          setDeletion={setDeletion}
          cols={cols}
          rows={rows}
          add={handleModalOpen}
          setEntriesToBeDeleted={setEntriesToBeDeleted}
          setFilters={setFilters}
          setFrom={setFrom}
          setTo={setTo}
          onUpdate={handleUpdate}
          totalCount={totalCount || 2}
          setRowClicked={setRowClicked}
          deleteMode={deleteMode}
        />
      </div>
      <Alert
        className={`success-msg ${successMsg ? 'active' : ''}`}
        variant="success"
      >
        {successMsg}
      </Alert>
    </div>
  );
};

export default ReadUsers;
