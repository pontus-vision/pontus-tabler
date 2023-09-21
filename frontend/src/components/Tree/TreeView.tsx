import React, { useEffect, useState } from 'react';
import FolderItem, { Folder } from './FolderItem';
import defaultData from './data';
import { AiFillFolderAdd } from 'react-icons/ai';

type Props = {
  data?: any;
  onSelect?: (data: Folder | File) => void;
  actionsMode?: boolean;
};

const TreeView = ({ data, onSelect, actionsMode = true }: Props) => {
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [expandedFolders, setExpandedFolders] = useState([]);
  const [newFolder, setNewFolder] = useState<Folder>();

  const [createFolder, setCreateFolder] = useState(false);
  const [jsonData, setJsonData] = useState(data || defaultData);

  const handleFolderSelect = (folder) => {
    setSelectedFolder(folder);
  };

  const addFolder = () => {
    if (!selectedFolder || !newFolder) return;

    const folder = findFolderById(jsonData, selectedFolder.id);
    if (folder) {
      const updatedFolder = {
        ...folder,
        children: folder.children
          ? [...folder.children, newFolder]
          : [newFolder],
      };

      // Update the data with the new folder
      updateFolder(jsonData, updatedFolder);
    }
  };

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

  const findFolderById = (folder, targetId) => {
    if (folder.id === targetId) {
      return folder;
    }

    for (const child of folder.children) {
      if (child.type === 'folder') {
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
    onSelect && onSelect(selectedFolder);
  }, [selectedFolder]);

  return (
    <div className="relative">
      {actionsMode && (
        <div className="flex justify-end">
          <AiFillFolderAdd
            onClick={() => setCreateFolder(!createFolder)}
            className={'text-3xl h-12 mb-0 cursor-pointer'}
          ></AiFillFolderAdd>
          <div
            className={`flex flex-col gap-3 z-1 absolute top-8 p-2 ${
              createFolder ? '' : 'hidden'
            } bg-white border rounded-md `}
          >
            <input
              className={
                'mt-1 p-2 w-full border rounded-md focus:ring focus:ring-opacity-50 focus:border-indigo-500'
              }
              type="text"
              onChange={(e) =>
                setNewFolder({
                  name: e.target.value,
                  type: 'folder',
                  id: e.target.value.toLocaleLowerCase(),
                  children: [],
                })
              }
            />
            <button onClick={addFolder}>Create</button>
          </div>
        </div>
      )}
      <FolderItem
        folder={jsonData}
        onSelect={handleFolderSelect}
        onToggle={handleFolderToggle}
        selected={selectedFolder?.path}
      />
    </div>
  );
};

export default TreeView;
