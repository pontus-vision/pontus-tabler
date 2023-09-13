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
    <form className="auth-group-form" onSubmit={handleSubmit}>
      <div className="auth-group-form-field">
        <label htmlFor="name" className="custom-label">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={handleNameChange}
          className="custom-input"
        />
      </div>
      <div className="auth-group-form-field">
        <label htmlFor="parents" className="custom-label">
          Select a folder:
        </label>
        <TreeView />
      </div>
      <div className="auth-group-form-field">
        <label htmlFor="symlinks" className="custom-label">
          Symlinks
        </label>
        <Select
          id="symlinks"
          name="symlinks"
          options={symlinkOptions}
          isMulti
          onChange={handleSymlinkChange}
          className="custom-select"
        />
      </div>
      <button className="auth-group-button">
        {!values ? 'Create Auth Group' : 'Update Auth Group'}
      </button>
    </form>
  );
};

export default AuthGroupForm;
