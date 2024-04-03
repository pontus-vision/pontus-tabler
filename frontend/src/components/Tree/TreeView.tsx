import { useEffect, useRef, useState } from 'react';
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
  const [newFolderName, setNewFolderName] = useState<string>();
  const input = useRef<HTMLInputElement>(null);

  const handleFolderSelect = (folder: MenuItemTreeRef) => {
    setSelectedFolder(folder);
  };

  useEffect(() => {
    if (onSelect && selectedFolder) {
      onSelect(selectedFolder);
    }
  }, [selectedFolder]);

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
              // value={newFolderName}
              ref={input}
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

                newFolder &&
                  onCreate({ ...selectedFolder, children: [newFolder] });
                if (input.current) {
                  input.current.value = '';
                }
              }}
            >
              Create
            </button>
          </div>
        </div>
      )}
      <FolderItem
        folder={data}
        onSelect={handleFolderSelect}
        // onToggle={handleFolderToggle}
        selected={selectedFolder?.path}
        onUpdate={onUpdate}
        onCreate={onCreate}
        actionsMode={true}
      />
    </div>
  );
};

export default TreeView;
