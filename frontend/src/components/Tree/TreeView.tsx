import { useEffect, useRef, useState } from 'react';
import FolderItem from './FolderItem';
import { AiFillFolderAdd } from 'react-icons/ai';
import { MenuItemTreeRef } from '../../pontus-api/typescript-fetch-client-generated';
import NotificationManager, { Message, MessageRefs } from '../NotificationManager';

type Props = {
  data?: any;
  onCreate: (data: MenuItemTreeRef) => void;
  onSelect?: (data: MenuItemTreeRef) => void;
  onUpdate?: (data: MenuItemTreeRef) => void;
  selectionOnly: boolean;
  actionsMode?: boolean;
};

const TreeView = ({
  onCreate,
  data,
  onSelect,
  actionsMode = true,
  onUpdate,
  selectionOnly
}: Props) => {
  const [selectedFolder, setSelectedFolder] = useState<MenuItemTreeRef>();
  const [newFolder, setNewFolder] = useState<MenuItemTreeRef>();
  const [createFolder, setCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState<string>();
  const input = useRef<HTMLInputElement>(null);
  const notificationManagerRef = useRef<MessageRefs>();
  const handleFolderSelect = (folder: MenuItemTreeRef) => {
    setSelectedFolder(folder);
  };

  const sendNotification = (msg: Message) => {
    notificationManagerRef?.current?.addMessage(
      msg.type,
      msg.title,
      msg.description,
    );
  }

  useEffect(() => {
    if (onSelect && selectedFolder) {
      onSelect(selectedFolder);
    }
  }, [selectedFolder]);

  return (
    <div className="tree-view" data-cy="tree-view">
      {actionsMode && (
        <div className="tree-view__create-view" data-cy="tree-view__create-view">
          <AiFillFolderAdd
            onClick={() => setCreateFolder(!createFolder)}
            className="tree-view__open-box-btn"
            data-cy="tree-view__open-box-btn"
          ></AiFillFolderAdd>
          {
            createFolder &&
            <div
              className={`tree-view__create-box`}
              data-cy="tree-view__create-box"
            >
              <input
                className="tree-view__create-box__input"
                data-cy="tree-view__create-view__input"
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
                data-cy="tree-view__create-view__create-btn"
                onClick={() => {
                  setCreateFolder(false);
                  console.log({ selectedFolder, newFolder })
                  if (selectedFolder?.path) {
                    newFolder &&
                      onCreate({ ...newFolder, path: selectedFolder?.path });
                  } else {
                    sendNotification({ title: 'Fail', type: 'info', description: 'Please, select a folder in order to create a folder.' })
                  }
                  if (input.current) {
                    input.current.value = '';
                  }
                }}
              >
                Create
              </button>
            </div>
          }
        </div>
      )}
      <FolderItem
        selectionOnly={selectionOnly}
        folder={data}
        onSelect={handleFolderSelect}
        // onToggle={handleFolderToggle}
        selected={selectedFolder?.path}
        onUpdate={onUpdate}
        onCreate={onCreate}
        actionsMode={true}
      />
      <NotificationManager ref={notificationManagerRef} style="position: absolute;" />
    </div>
  );
};

export default TreeView;
