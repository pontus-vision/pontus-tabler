import { useEffect, useState } from 'react';
import { deleteUser, readAuthGroups } from '../../client';
import { ColDef } from 'ag-grid-community';
import {
  Group,
  ReadPaginationFilterFilters,
} from '../../pontus-api/typescript-fetch-client-generated';
import PVGridWebiny2 from '../../pv-react/PVGridWebiny2';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';
import { useNavigate } from 'react-router-dom';

const ReadAuthGroups = () => {
  const [cols, setCols] = useState<ColDef[]>([
    {
      headerClass: 'Name',
      field: 'name',
      sortable: true,
      filter: true,
    },
    {
      headerClass: 'Group Id',
      field: 'groupId',
      sortable: true,
      filter: true,
    },
  ]);
  const [rows, setRows] = useState<{ [key: string]: unknown }[]>();
  const [filters, setFilters] = useState<ReadPaginationFilterFilters[]>();
  const [from, setFrom] = useState<number>();
  const [to, setTo] = useState<number>();
  const [totalCount, setTotalCount] = useState<number>(2);
  const [entriesToBeDeleted, setEntriesToBeDeleted] = useState<Group[]>([]);
  const [deletion, setDeletion] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await readAuthGroups({
          filters,
          from,
          to,
        });

        setRows(res?.data.authGroups || []);
        setTotalCount(res?.data.totalGroups || 2);

        return res;
      } catch (error) {
        console.error(error);
      }
    };

    fetchGroups();
  }, [filters, from, to]);

  const handleDeleteGroups = async () => {
    try {
      for (const entry of entriesToBeDeleted) {
        if (!entry?.groupId) return;
        const res = await deleteUser(entry?.groupId);
        if (res?.statusText !== 'OK') {
          throw new Error('Something wrong happened. Deletion failed.');
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = (group) => {
    navigate('/auth/group/update/' + group.groupId);
  };

  const handleAdd = () => {
    navigate('/auth/group/create');
  };

  const handleCloseDeleteModal = () => {
    setDeletion(false);
  };

  if (!rows) return;

  return (
    <div className="auth-groups-read">
      {entriesToBeDeleted?.length > 0 && (
        <DeleteConfirmationModal
          onDelete={handleDeleteGroups}
          onClose={handleCloseDeleteModal}
          isOpen={deletion}
        />
      )}
      <div className="auth-groups-read__grid">
        <PVGridWebiny2
          add={handleAdd}
          onUpdate={handleUpdate}
          setDeletion={setDeletion}
          setEntriesToBeDeleted={setEntriesToBeDeleted}
          cols={cols}
          rows={rows}
          totalCount={totalCount}
        />
      </div>
    </div>
  );
};

export default ReadAuthGroups;
