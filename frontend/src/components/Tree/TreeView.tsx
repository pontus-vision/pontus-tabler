import React, { useEffect, useState } from 'react';
import FolderItem, { Folder } from './FolderItem';
import defaultData from './data';
import { AiFillFolderAdd } from 'react-icons/ai';
import { MenuItemTreeRef } from '../../pontus-api/typescript-fetch-client-generated';

type Props = {
  data?: any;
  onCreate: (data: MenuItemTreeRef) => void;
  onSelect?: (data: Folder | File) => void;
  actionsMode?: boolean;
};

const TreeView = ({ onCreate, data, onSelect, actionsMode = true }: Props) => {
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [expandedFolders, setExpandedFolders] = useState([]);
  const [newFolder, setNewFolder] = useState<MenuItemTreeRef>();

  const [createFolder, setCreateFolder] = useState(false);
  const [jsonData, setJsonData] = useState(data);

  const handleFolderSelect = (folder) => {
    setSelectedFolder(folder);
  };

  useEffect(() => {
    setJsonData(data);
  }, [data]);

  // const addFolder = () => {
  //   if (!selectedFolder || !newFolder) return;

  //   const folder = findFolderById(jsonData, selectedFolder.id);
  //   if (folder) {
  //     const updatedFolder = {
  //       ...folder,
  //       children: folder.children
  //         ? [...folder.children, newFolder]
  //         : [newFolder],
  //     };

  //     // Update the data with the new folder
  //     updateFolder(jsonData, updatedFolder);
  //   }
  // };

  const updateFolder = (currentFolder: Folder, updatedFolder: Folder) => {
    if (currentFolder.id === updatedFolder.id) {
      Object.assign(currentFolder, updatedFolder);
    } else {
      currentFolder.children.forEach((child) => {
        if (child.type === 'folder') {
          updateFolder(child, updatedFolder);
        }
      });
    }

    setJsonData({ ...jsonData }); // Update the state to trigger re-render
  };

  const findFolderById = (folder, targetId): any => {
    if (folder.id === targetId) {
      return folder;
    }

    for (const child of folder.children) {
      if (child.kind === 'folder') {
        const found = findFolderById(child, targetId);
        if (found) {
          return found;
        }
      }
    }

    return null;
  };

  const handleFolderToggle = (folderId, isOpen) => {
    if (isOpen) {
      setExpandedFolders((prevState) =>
        prevState.filter((id) => id !== folderId),
      );
    } else {
      setExpandedFolders((prevState) => [...prevState, folderId]);
    }
  };

  useEffect(() => {
    console.log({ createFolder });
  }, [createFolder]);
  useEffect(() => {
    onSelect && onSelect(selectedFolder);
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
              onChange={(e) =>
                setNewFolder({
                  name: e.target.value,
                  kind: MenuItemTreeRef.KindEnum.Folder,
                  // id: e.target.value.toLocaleLowerCase(),
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
        onToggle={handleFolderToggle}
        selected={selectedFolder?.path}
        onEditInputChange={(e) => console.log(e)}
        actionsMode={true}
      />
    </div>
  );
};

export default TreeView;
