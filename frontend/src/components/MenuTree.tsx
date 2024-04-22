import { useEffect, useState } from 'react';
import { readMenu, createMenu, updateMenu } from '../client';
import {
  MenuItemTreeRef,
  MenuUpdateReq,
} from '../pontus-api/typescript-fetch-client-generated';
import TreeView from './Tree/TreeView';
import { IoMdClose } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

type Props = {
  onUpdate?: (data: MenuItemTreeRef) => void;
  onCreate?: (data: MenuItemTreeRef) => void;
  onSelect?: (data: MenuItemTreeRef) => void;
};

const MenuTree = ({ onCreate, onSelect, onUpdate }: Props) => {
  const [data, setData] = useState<MenuItemTreeRef>();
  const [selectedItem, setSelectedItem] = useState<MenuItemTreeRef>();
  const navigate = useNavigate();

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
      const res = await createMenu(folder);

      if (res?.status === 200) {
        setData(
          (prevState) =>
            // if (prevState && res.data?.path) {
            updateNodeByPath(prevState, res.data?.path, res.data),
          // }
        );
        navigate('/dashboard/update/' + res?.data.id, { state: folder });
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

    console.log({ res, data });
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
    console.log({ selection, res });

    res?.status === 200 &&
      setData((prevState) =>
        updateNodeByPath(prevState, selection?.path, {
          ...res.data,
          children: res.data.children?.toSorted((a, b) =>
            a?.name?.localeCompare(b?.name),
          ),
        }),
      );
  };

  return (
    <>
      {data && (
        <TreeView
          data={data}
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
