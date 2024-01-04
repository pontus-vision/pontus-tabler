import { useEffect, useState } from 'react';
import { readMenu, createMenu } from '../client';
import {
  MenuItemTreeRef,
  MenuReadRes,
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
        } else if (res?.status === 404) {
          await createMenu({
            name: '/',
            kind: MenuItemTreeRef.KindEnum.Folder,
            path: '/',
          });
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
      const obj = {
        ...selectedItem,
        children: [
          ...(selectedItem?.children || []),
          {
            ...folder,
            path: `${selectedItem?.path}${
              selectedItem?.path?.endsWith('/') ? '' : '/'
            }${folder.name}`,
          },
        ],
      };

      const res = await createMenu(obj);

      if (res?.status === 200) {
        setData((prevState) => {
          if (prevState && res.data?.path) {
            return updateNodeByPath(prevState, res.data?.path, res.data);
          }
        });
        createMessage(`${folder?.kind} created.`);
      }
      if (res?.status === 409) {
        createMessage(
          // `${selectedItem?.path}${
          //   selectedItem?.path?.endsWith('/') ? '' : '/'
          // }${folder.name} already exist.`,
          `"${folder.name}" already taken in this directory. (${selectedItem?.path})`,
        );
      }
    } catch (error) {
      console.error({ error });
    }
  };

  const handleSelect = async (selection: MenuItemTreeRef) => {
    setSelectedItem(selection);
    console.log(selection);
    const res = selection?.path && (await readMenu({ path: selection?.path }));

    res &&
      setData((prevState) => {
        if (prevState && selection?.path) {
          return updateNodeByPath(prevState, selection?.path, res.data);
        }
      });
  };

  return (
    <>
      {data && (
        <TreeView
          data={data}
          actionsMode={true}
          onSelect={handleSelect}
          onCreate={handleCreate}
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
