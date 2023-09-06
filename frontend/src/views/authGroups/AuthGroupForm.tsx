import { useEffect, useState } from 'react';
import { ReadPaginationFilter2Filters } from '../../pontus-api/typescript-fetch-client-generated';
import Select from 'react-select';
import { readAuthGroups } from '../../client';
import TreeView from '../../components/Tree/TreeView';
import FolderItem from '../../components/Tree/FolderItem';
import data from '../../components/Tree/data';

type Props = {
  onSubmit: (body: {
    name: string;
    parents: string[];
    symlinks: string[];
  }) => void;
  values?: {
    name?: string;
    parents?: string[];
    symlinks?: string[];
  };
};

const AuthGroupForm = ({ onSubmit, values }: Props) => {
  const [name, setName] = useState(values?.name);
  const [selectedParents, setSelectedParents] = useState(values?.parents);
  // values?.parents.map((parent) => {
  //   return {
  //     value: parent,
  //     label: parent,
  //   };
  // }) || [],
  const [selectedSymlinks, setSelectedSymlinks] = useState(values?.symlinks);
  // values?.symlinks.map((symlink) => {
  //   return {
  //     value: symlink,
  //     label: symlink,
  //   };
  // }) || [],
  const [parentOptions, setParentOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [symlinkOptions, setSymlinkOptions] = useState([
    { value: 'symlink1', label: 'Symlink 1' },
    { value: 'symlink2', label: 'Symlink 2' },
  ]);
  const [filters, setFilters] = useState<ReadPaginationFilter2Filters>();
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(0);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleParentChange = (selectedOptions) => {
    // setSelectedParents(selectedOptions);
    console.log(selectedOptions);
  };

  const handleSymlinkChange = (selectedOptions) => {
    setSelectedSymlinks(selectedOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSubmit({
      name,
      parents: selectedParents || [],
      symlinks: selectedSymlinks || [],
    });
  };

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await readAuthGroups({
          filters,
          from,
          to,
        });

        setParentOptions(
          res?.data.authGroups?.map((group) => {
            return {
              value: group.groupId || '',
              label: group.name || '',
            };
          }) || [],
        );
      } catch (error) {
        console.error(error);
      }
    };
    console.log({ values });
    fetchGroups();
  }, []);

  useEffect(() => {
    setName(values?.name);
    setSelectedParents(values?.parents);
    setSelectedSymlinks(values?.symlinks);
  }, [values]);

  return (
    <form
      className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg w-1/2"
      onSubmit={handleSubmit}
    >
      <div className="mb-4">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={handleNameChange}
          className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-opacity-50 focus:border-indigo-500"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="parents"
          className="block text-sm font-medium text-gray-700"
        >
          Select a folder:
        </label>
        {/* <Select
          id="parents"
          name="parents"
          options={parentOptions}
          isMulti
          onChange={handleParentChange}
        /> */}
        <TreeView />
        {/* <FolderItem folder={data} onSelect={handleParentChange} /> */}
      </div>
      <div className="mb-4">
        <label
          htmlFor="symlinks"
          className="block text-sm font-medium text-gray-700"
        >
          Symlinks
        </label>
        <Select
          id="symlinks"
          name="symlinks"
          options={symlinkOptions}
          isMulti
          onChange={handleSymlinkChange}
        />
      </div>
      <button
        type="submit"
        className="w-full bg-indigo-500 text-white p-2 rounded-md hover:bg-indigo-600 transition duration-300"
      >
        {!values ? 'Create Auth Group' : 'Update Auth Group'}
      </button>
    </form>
  );
};

export default AuthGroupForm;
