import React, { useState } from 'react';
import { DataRoot, Child } from '../../types';
import { MenuItemTreeRef } from '../../pontus-api/typescript-fetch-client-generated';
import { useLocation, useNavigate } from 'react-router-dom';
import { MenuUpdateReq } from '../../typescript/api';

type Props = {
  onSelect?: (folderId: MenuItemTreeRef) => void;
  onUpdate: (data: MenuUpdateReq) => void;
  selected: string;
  path?: string;
  parentFolder: MenuItemTreeRef;
  file: any;
  actionsMode: boolean;
  selectionOnly: boolean
};

const FileItem = ({
  path,
  file,
  selected,
  actionsMode,
  onSelect,
  onUpdate,
  parentFolder,
  selectionOnly
}: Props) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
  } | null>()
  const location = useLocation()

  const handleSelect = () => {
    if (selectionOnly) return
    onSelect && onSelect({ ...file, path: path || '/' });

    navigate(`/dashboard/update/${file.id}`, { state: { ...file, path } });
  };

  const handleContextMenuClick = (action: 'rename' | 'delete' | 'create') => {
    switch (action) {
      case 'rename':
        setIsEditing(true);
        break;
      case 'delete':
        // Implement the delete functionality here
        break;
      default:
        break;
    }
    setContextMenu(null);
  };

  const handleContextMenu = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (!actionsMode) return;
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
    });
  };

  return (
    <div
      key={file?.id}
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
          // defaultValue={editedName}
          onKeyDown={(e) => {
            if (e.key.toLowerCase() === 'enter') {
              const newName = event.target.value;

              onUpdate({
                path: parentFolder.path,
                id: parentFolder.id,
                children: [
                  { path: file.path, id: file.id, name: newName, kind: 'file' },
                ],
              });
              setIsEditing(false);
            }
          }}
        />
      ) : (
        <div
          onClick={handleSelect}
          className={`cursor-pointer pl-2 ${selected === path ? 'text-blue-500' : ''
            }`}
        >
          📄 {file.name}
        </div>
      )}
      {contextMenu && selected === file.path && (
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
          {!selectionOnly && <div
            className="cursor-pointer hover:bg-gray-100 p-1"
            onClick={() => handleContextMenuClick('create')}
          >
            Create
          </div>}
        </div>
      )}
    </div>
  );
};

export default FileItem;
