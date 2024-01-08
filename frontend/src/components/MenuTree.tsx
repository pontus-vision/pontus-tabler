import { useEffect, useState } from 'react';
import { readMenu, createMenu, updateMenu } from '../client';
import {
  MenuItemTreeRef,
  MenuUpdateReq,
} from '../pontus-api/typescript-fetch-client-generated';
import TreeView from './Tree/TreeView';
import { IoMdClose } from 'react-icons/io';

const MenuTree = () => {
  const [data, setData] = useState<MenuItemTreeRef>();
  const [selectedItem, setSelectedItem] = useState<MenuItemTreeRef>();
  const [message, setMessage] = useState<string>();

  useEffect(() => {
    const fetchMenu = async (path: string) => {
      try {
        const res = await readMenu({ path });

        if (res?.status === 200) {
          setData(res.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchMenu('/');
  }, []);

  const createMessage = (message: string) => {
    setMessage(message);
    console.log({ message });

    // setTimeout(() => {
    //   setMessage('');
    // }, 8000);
  };

  function updateNodeByPath(
    node: MenuItemTreeRef,
    path: string,
    newData: MenuItemTreeRef,
  ): MenuItemTreeRef {
    if (node.path === path) {
      return { ...node, ...newData };
    }

    if (!node?.children) {
      node.children = [];
    }

    return {
      ...node,
      children: node.children.map((child) =>
        updateNodeByPath(child, path, newData),
      ),
    };
  }

  const handleCreate = async (folder: MenuItemTreeRef) => {
    try {
      const obj: MenuUpdateReq = {
        ...selectedItem,
        id: selectedItem?.id || '',
        children: [
          {
            ...folder,
            path: `${selectedItem?.path}${
              selectedItem?.path?.endsWith('/') ? '' : '/'
            }${folder.name}`,
          },
        ],
      };

      const res = await updateMenu(obj);
      console.log({ res });

      if (res?.status === 200) {
        setData(
          (prevState) =>
            // if (prevState && res.data?.path) {
            updateNodeByPath(prevState, res.data?.path, res.data),
          // }
        );
        createMessage(`${folder?.kind} created.`);
      }
      if (res?.status === 409) {
        createMessage(
          `"${folder.name}" already taken in this directory. (${selectedItem?.path})`,
        );
      }
    } catch (error) {
      console.error({ error });
    }
  };
  useEffect(() => {
    console.log({ message });
  }, [message]);

  const handleUpdate = async (data: MenuUpdateReq) => {
    const res = await updateMenu(data);

    console.log({ res, data });
    if (res?.status === 200) {
      setData(
        (prevState) =>
          // if (prevState && res.data?.path) {
          updateNodeByPath(prevState, res.data?.path, res.data),
        // }
      );
      setMessage('Folder updated!');
    } else if (res?.status === 409) {
      setMessage('That name already exists under the parent folder');
    }
  };

  const handleSelect = async (selection: MenuItemTreeRef) => {
    setSelectedItem(selection);
    const res = await readMenu({ path: selection?.path });
    console.log({ selection, res });

    res?.status === 200 &&
      setData((prevState) =>
        updateNodeByPath(prevState, selection?.path, res.data),
      );
  };

  useEffect(() => {
    console.log({ data });
  }, [data]);

  return (
    <>
      {data && (
        <TreeView
          data={data}
          actionsMode={true}
          onSelect={handleSelect}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
        />
      )}

      <div id="messageBox" className={`menu-tree ${message ? 'opened' : ''}`}>
        {message}
        <IoMdClose
          style={{ position: 'absolute', top: '2px', right: '5px' }}
          onClick={() => setMessage('')}
        />
      </div>
    </>
  );
};

export default MenuTree;
