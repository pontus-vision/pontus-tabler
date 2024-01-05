import { useEffect, useState } from 'react';
import FolderItem from './FolderItem';
import { AiFillFolderAdd } from 'react-icons/ai';
import { MenuItemTreeRef } from '../../pontus-api/typescript-fetch-client-generated';

type Props = {
  data?: any;
  onCreate: (data: MenuItemTreeRef) => void;
  onSelect?: (data: MenuItemTreeRef) => void;
  onUpdate?: (data: MenuItemTreeRef) => void;
  actionsMode?: boolean;
};

const TreeView = ({
  onCreate,
  data,
  onSelect,
  actionsMode = true,
  onUpdate,
}: Props) => {
  const [selectedFolder, setSelectedFolder] = useState<MenuItemTreeRef>();
  const [newFolder, setNewFolder] = useState<MenuItemTreeRef>();
  const [createFolder, setCreateFolder] = useState(false);
  const [jsonData, setJsonData] = useState(data);

  const handleFolderSelect = (folder: MenuItemTreeRef) => {
    setSelectedFolder(folder);
  };

  useEffect(() => {
    if (onSelect && selectedFolder) {
      onSelect(selectedFolder);
    }
  }, [selectedFolder]);

  const obj2 = {
    _attachments: 'attachments/',
    _etag: '"00000000-0000-0000-3f57-49e990d201da"',
    _rid: 'fhwFAKtEy8MCAAAAAAAAAA==',
    _self: 'dbs/fhwFAA==/colls/fhwFAKtEy8M=/docs/fhwFAKtEy8MCAAAAAAAAAA==/',
    _ts: 1704404709,
    children: [],
    id: 'b0d9a341-ae73-4b07-bf6d-2303b124ebe9',
    kind: 'file',
    name: 'file1',
    path: '/file1',
  };

  return (
    <div className="tree-view">
      {actionsMode && (
        <div className="tree-view__create-view">
          <AiFillFolderAdd
            onClick={() => setCreateFolder(!createFolder)}
            className="tree-view__open-box-btn"
          ></AiFillFolderAdd>
          <div
            className={`tree-view__create-box ${createFolder ? '' : 'hidden'}`}
          >
            <input
              className="tree-view__create-box__input"
              type="text"
              onChange={(e) =>
                setNewFolder({
                  name: e.target.value,
                  kind: 'folder',
                  children: [],
                })
              }
            />
            <button
              onClick={() => {
                setCreateFolder(false);
                newFolder && onCreate(newFolder);
              }}
            >
              Create
            </button>
          </div>
        </div>
      )}
      <FolderItem
        folder={jsonData}
        onSelect={handleFolderSelect}
        // onToggle={handleFolderToggle}
        selected={selectedFolder?.path}
        onUpdate={onUpdate}
        actionsMode={true}
      />
    </div>
  );
};

export default TreeView;
