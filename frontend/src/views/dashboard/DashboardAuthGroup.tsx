import { useEffect, useState } from 'react';
import TreeView from '../../components/Tree/TreeView';
import Select from 'react-select';
import DragAndDropArray from '../../DragAndDrop';

const DashboardAuthGroup = () => {
  const [permissions, setPermissions] = useState();
  const [group, setGroup] = useState();
  const [groupsPermissions, setGroupsPermissions] = useState([]);

  const handleSelect = (data: any) => {
    console.log(data);
    setGroup(data);
  };

  useEffect(() => {
    if (!group) return;

    setGroupsPermissions([...groupsPermissions]);
  }, [group]);

  const authOptions = [
    { value: 'create', label: 'Create' },
    { value: 'read', label: 'Read' },
    { value: 'update', label: 'Update' },
    { value: 'delete', label: 'Delete' },
  ];

  return (
    <div className="pt-4">
      <DragAndDropArray />
    </div>
  );
};

export default DashboardAuthGroup;
