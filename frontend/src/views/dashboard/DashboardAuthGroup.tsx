import { useEffect, useState } from 'react';
import TreeView from '../../components/Tree/TreeView';
import Select from 'react-select';
import DragAndDropArray from '../../DragAndDrop';

const DashboardAuthGroup = () => {
  const [permissions, setPermissions] = useState();
  const [group, setGroup] = useState();
  const [groupsPermissions, setGroupsPermissions] = useState([])

  const handleSelect = (data: any) => {
    console.log(data);
    setGroup(data);
  };

  useEffect(() => {
    if (!group) return;

    setGroupsPermissions([...groupsPermissions, ])
  }, [group]);

  const authOptions = [
    { value: 'create', label: 'Create' },
    { value: 'read', label: 'Read' },
    { value: 'update', label: 'Update' },
    { value: 'delete', label: 'Delete' },
  ];

  return (
//    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
//      <div className="max-w-md w-1/2 p-6 bg-white shadow-md rounded-lg">
//        <label htmlFor="">Dashboard Auth</label>
//        <TreeView onSelect={handleSelect} />
//        <Select
//          options={authOptions}
//          isMulti
//          value={permissions}
//          onChange={(selectedOptions) => setPermissions(selectedOptions)}
//          className="mt-4"
//          styles={{
//            container: (provided) => ({
//              ...provided,
//              width: '100%',
//            }),
//          }}
//        />
//      </div>
//    </div>
    <div className='pt-4'>

  <DragAndDropArray />
    </div>
  );
};

export default DashboardAuthGroup;
