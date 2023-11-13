import React, { useEffect, useState } from 'react';
import { DataRoot, Child } from '../../types';
import FileItem from './FileItem';

export type Folder = {
  id: string;
  name: string;
  type: string;

  children: Array<Folder | File>;
};

export type File = {
  id: string;
  name: string;
  type: string;
};

type FolderItemProps = {
  folder: Child | DataRoot;
  onSelect?: (folderId: DataRoot | Child) => void;
  selected?: string;
  onDragStart?: (
    event: React.DragEvent<HTMLDivElement>,
    index: number,
    item: Child | DataRoot,
  ) => void;
  index?: number;
  path?: string;
  actionsMode: boolean;
};

const FolderItem = ({
  folder,
  onSelect,
  selected,
  onDragStart,
  index,
  path,
  actionsMode,
}: FolderItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(folder.name);
  const [contextMenu, setContextMenu] = useState(null); // Track context menu state
  const [selectedItem, setSelectedItem] = useState();
  const [currentPath, setCurrentPath] = useState(path + '/' + folder.id);

  const toggleFolder = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = () => {
    toggleFolder();
    onSelect && onSelect({ ...folder, path: path || '/' });
  };

  const handleEdit = () => {
    if (!actionsMode) return;
    setIsEditing(true);
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedName(e.target.value);
  };

  const handleEditSave = () => {
    setIsEditing(false);
    // Update the folder's name here
    folder.name = editedName;
  };

  const handleContextMenu = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (!actionsMode) return;
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleContextMenuClick = (action: 'rename' | 'delete' | 'create') => {
    switch (action) {
      case 'rename':
        setIsEditing(true);
        break;
      case 'delete':
        // Implement the delete functionality here
        break;
      case 'create':
        // Implement the create functionality here
        break;
      default:
        break;
    }
    setContextMenu(null);
  };

  useEffect(() => {
    const handleWindowClick = () => {
      setContextMenu(null);
    };

    // Add the event listener when the component mounts
    window.addEventListener('click', handleWindowClick);

    // Remove the event listener when the component unmounts
    return () => {
      window.removeEventListener('click', handleWindowClick);
    };
  }, []);
  useEffect(() => {
    console.log(selected === folder.path, { selected, path });
  }, [selected]);

  return (
    <div
      className={'mb-2 '}
      onBlur={() => setContextMenu(null)}
      // actionsMode={actionsMode}
      onContextMenu={handleContextMenu}
      onDragStart={(e) => {
        onSelect && onSelect(folder);
        onDragStart && onDragStart(e, index || 0, folder);
      }}
      draggable
    >
      {isEditing ? (
        <input
          type="text"
          value={editedName}
          onChange={handleEditInputChange}
          onBlur={handleEditSave}
        />
      ) : (
        <span
          className={`cursor-pointer ${
            selected === path ? 'text-blue-500' : ''
          }`}
          onClick={onSelect ? handleSelect : toggleFolder}
          onDragStart={() => console.log('Dragging')}
          onDoubleClick={handleEdit}
        >
          {isOpen ? '📂' : '📁'} {folder.name}
        </span>
      )}
      {isOpen && folder?.children && (
        <ul className="pl-4 ">
          {folder?.children.map((child, index) => (
            <li key={child.id}>
              {child.kind === 'folder' ? (
                <FolderItem
                  onDragStart={onDragStart}
                  index={index}
                  folder={child}
                  onSelect={onSelect}
                  selected={selected}
                  path={`${!!path ? path : ''}/${child.name}`}
                  actionsMode={actionsMode}
                />
              ) : (
                <FileItem
                  file={child}
                  onSelect={onSelect}
                  selected={selected || ''}
                  path={`${!!path ? path : ''}/${child.name}`}
                  actionsMode={actionsMode}
                />
              )}
            </li>
          ))}
        </ul>
      )}
      {contextMenu && (
        <div
          className="fixed bg-white border border-gray-300 shadow-lg p-2"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <div
            className="cursor-pointer hover:bg-gray-100 p-1"
            onClick={() => handleContextMenuClick('rename')}
          >
            Rename
          </div>
          <div
            className="cursor-pointer hover:bg-gray-100 p-1"
            onClick={() => handleContextMenuClick('delete')}
          >
            Delete
          </div>
          <div
            className="cursor-pointer hover:bg-gray-100 p-1"
            onClick={() => handleContextMenuClick('create')}
          >
            Read File
          </div>
        </div>
      )}
    </div>
  );
};

export default FolderItem;
