import React, { useEffect, useState } from 'react';
import FileItem from './FileItem';
import { MenuItemTreeRef } from '../../pontus-api/typescript-fetch-client-generated';
import { useNavigate } from 'react-router-dom';

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
  parentFolder?: MenuItemTreeRef;
  folder: MenuItemTreeRef;
  onSelect?: (folderId: MenuItemTreeRef) => void;
  selected?: string;
  onDragStart?: (
    event: React.DragEvent<HTMLDivElement>,
    index: number,
    item: MenuItemTreeRef,
  ) => void;
  index?: number;
  path?: string;
  actionsMode: boolean;
  onUpdate?: (data: MenuItemTreeRef) => void;
  onCreate?: (data: MenuItemTreeRef) => void;
};

const FolderItem = ({
  folder,
  parentFolder,
  onSelect,
  selected,
  onDragStart,
  index,
  path,
  actionsMode,
  onUpdate,
  onCreate,
}: FolderItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(folder.name);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
  } | null>(); // Track context menu state
  const [selectedItem, setSelectedItem] = useState();
  const [currentPath, setCurrentPath] = useState(folder.path);
  const [updatedFolder, setUpdatedFolder] = useState<MenuItemTreeRef>();
  const [creation, setCreation] = useState(false);
  const navigate = useNavigate();

  const toggleFolder = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = () => {
    toggleFolder();
    onSelect && onSelect(folder);
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
        setCreation(true);

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
  }, []);

  useEffect(() => {
    if (isOpen) {
    } else {
      setCreation(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (creation) {
      setIsOpen(true);
    }
  }, [creation]);

  return (
    <div
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
          className="tree-item__input-rename"
          type="text"
          defaultValue={editedName}
          onChange={(e) => {
            // setEditedName(e?.target?.value);
            setUpdatedFolder &&
              setUpdatedFolder({
                id: folder?.id || '',
                name: e?.target?.value,
                path: folder.path,
              });
          }}
          onKeyDown={(e) => {
            if (e.key.toLowerCase() === 'enter') {
              const newName = event.target.value;

              onUpdate && updatedFolder && onUpdate(updatedFolder);
              setIsEditing(false);
            }
          }}
        />
      ) : (
        <span
          className={`cursor-pointer ${
            selected === path ? 'text-blue-500' : ''
          } ${selected === folder.path ? 'tree-item__highlighted' : ''}`}
          onClick={onSelect ? handleSelect : toggleFolder}
          onDragStart={() => console.log('Dragging')}
        >
          {isOpen ? '📂' : '📁'} {folder.name}
        </span>
      )}
      {creation && selected === folder.path && isOpen && (
        <input
          type="text"
          onKeyDown={(e) => {
            if (e.key.toLowerCase() === 'enter') {
              onCreate({
                path: folder.path,
                id: folder.id,
                children: [{ name: event.target.value, kind: 'file' }],
              });
              setCreation(false);
            }
          }}
        />
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
                  parentFolder={folder}
                  onSelect={onSelect}
                  selected={selected}
                  onUpdate={onUpdate}
                  onCreate={onCreate}
                  path={`${!!path ? path : ''}/${child.name}`}
                  actionsMode={actionsMode}
                />
              ) : (
                <FileItem
                  parentFolder={folder}
                  file={child}
                  onSelect={onSelect}
                  onUpdate={onUpdate}
                  selected={selected || ''}
                  path={`${!!path ? path : ''}/${child.name}`}
                  actionsMode={actionsMode}
                />
              )}
            </li>
          ))}
        </ul>
      )}
      {contextMenu && selected === folder.path && (
        <div
          className="menu-right-click"
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
            Create
          </div>
        </div>
      )}
    </div>
  );
};

export default FolderItem;
