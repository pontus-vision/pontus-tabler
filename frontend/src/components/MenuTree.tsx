import { useEffect, useState } from 'react';
import { readMenu, createMenu, updateMenu } from '../client';
import {
  MenuItemTreeRef,
} from '../pontus-api/typescript-fetch-client-generated';
import TreeView from './Tree/TreeView';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

type Props = {
  onUpdate?: (data: MenuItemTreeRef) => void;
  onCreate?: (data: MenuItemTreeRef) => void;
  onSelect?: (data: MenuItemTreeRef) => void;
  selectionOnly?: boolean
};

const MenuTree = ({ onCreate, onSelect, onUpdate, selectionOnly }: Props) => {
  const [data, setData] = useState<MenuItemTreeRef>();
  const [selectedItem, setSelectedItem] = useState<MenuItemTreeRef>();
  const [message, setMessage] = useState()
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
      const res = await createMenu(folder);

      if (res?.status === 200) {
        setData(
          (prevState) =>
            // if (prevState && res.data?.path) {
            updateNodeByPath(prevState, res.data?.path, res.data),
          // }
        );
        if (folder.kind === 'file') {
          navigate('/dashboard/create/', { state: { ...folder, id: res?.data.id } });
        }
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

  const handleUpdate = async (data: MenuItemTreeRef) => {
    const res = await updateMenu(data);

    if (res?.status === 200) {
      setData(
        (prevState) =>
          // if (prevState && res.data?.path) {
          updateNodeByPath(prevState, res.data?.path, res.data),
        // }
      );
    } else if (res?.status === 409) {
    }
  };

  const handleSelect = async (selection: MenuItemTreeRef) => {
    if (!selection.path) return;
    setSelectedItem(selection);
    const res = await readMenu({ path: selection?.path });

    res?.status === 200 &&
      setData((prevState) =>
        updateNodeByPath(prevState, selection?.path, {
          ...res.data,
          children: res.data.children

        }),
      );
  };

  return (
    <>
      {data && (
        <TreeView data={data}
          selectionOnly={selectionOnly}
          actionsMode={true}
          onSelect={onSelect || handleSelect}
          onCreate={onCreate || handleCreate}
          onUpdate={onUpdate || handleUpdate}
        />
      )}
    </>
  );
};

export default MenuTree;
