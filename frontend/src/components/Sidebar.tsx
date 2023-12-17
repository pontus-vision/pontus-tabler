import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import Button from 'react-bootstrap/esm/Button';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { RootState } from '../store/store';
import { useTranslation } from 'react-i18next';
import Form from 'react-bootstrap/esm/Form';
import { Child, Dashboard, DataRoot } from '../types';
import { setDashboardId } from '../store/sliceDashboards';
import { useAuth } from '../AuthContext';
import TreeView from './Tree/TreeView';
import { createMenu, readMenu } from '../client';
import data from './Tree/data';
import { File, Folder } from './Tree/FolderItem';
import {
  MenuDirectoryTreeRef,
  MenuReadRes,
} from '../pontus-api/typescript-fetch-client-generated';

type Props = {
  openedSidebar: boolean;
  setOpenedSidebar: Dispatch<SetStateAction<boolean>>;
};

const Sidebar = ({ openedSidebar, setOpenedSidebar }: Props) => {
  const [models, setModels] = useState() as any[];
  const [showForms, setShowForms] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [data, setData] = useState<MenuReadRes>();
  const [selectedItem, setSelectedItem] = useState<MenuDirectoryTreeRef>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { value: dashboards } = useSelector((state: RootState) => {
    return state.dashboards;
  });
  const { t, i18n } = useTranslation();

  function addChild(parentNode, childNode) {
    parentNode.children.push(childNode);
  }

  const fetchMenu = async (path: string) => {
    try {
      const res = await readMenu({ path });

      res?.status === 200 && setData(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMenu('/');
  }, []);
  const [tree, setTree] = useState({
    name: '/',
    kind: 'folder',
    path: '/',
    children: [],
  });

  useEffect(() => {
    console.log({ data });
  }, [data]);

  useEffect(() => {
    console.log({ tree });
  }, [tree]);

  const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;
    i18n.changeLanguage(selectedLanguage);
  };

  const handleCreate = async (folder: MenuDirectoryTreeRef) => {
    console.log({
      folder,
      createdPath: `${selectedItem?.path}${
        selectedItem?.path?.endsWith('/') ? '' : '/'
      }${folder.name}`,
    });
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

      res &&
        setData((prevState) =>
          updateNodeByPath(prevState, folder?.path, res.data),
        );

      console.log({ res, obj });
    } catch (error) {}
  };

  // useEffect(() => {
  //   console.log({ selectedItem: selectedItem });
  // }, [selectedItem]);

  const onClickNavigate = (endpoint: string) => {
    var width = window.innerWidth;
    var height = window.innerHeight;

    // Perform actions based on device dimensions
    if (width < 768) {
      setOpenedSidebar(false);
      console.log('Small device');
      // Perform specific actions for small devices
    } else if (width >= 768 && width < 1024) {
      // Medium devices (e.g., tablets)
      console.log('Medium device');
      // Perform specific actions for medium devices
    } else {
      // Large devices (e.g., desktops)
      console.log('Large device');
      // Perform specific actions for large devices
    }

    navigate(endpoint);
    setOpenedSidebar(false);
  };

  const [deviceSize, setDeviceSize] = useState<string>();
  var width = window.innerWidth;

  useEffect(() => {
    var width = window.innerWidth;
    var height = window.innerHeight;

    if (width < 768) {
      setDeviceSize('sm');
      // Perform specific actions for small devices
    } else if (width >= 768 && width < 1024) {
      // Medium devices (e.g., tablets)
      setDeviceSize('md');
      // Perform specific actions for medium devices
    } else {
      // Large devices (e.g., desktops)
      setDeviceSize('lg');
      // Perform specific actions for large devices
    }
  }, [width]);

  useEffect(() => {
    console.log(deviceSize);
  }, [deviceSize]);

  function updateNodeByPath(node, path, newData) {
    if (node.path === path) {
      return { ...node, ...newData };
    }

    return {
      ...node,
      children: node.children.map((child) =>
        updateNodeByPath(child, path, newData),
      ),
    };
  }

  const handleSelect = async (selection: MenuDirectoryTreeRef) => {
    setSelectedItem(selection);
    console.log(selection);
    const res = selection?.path && (await readMenu({ path: selection?.path }));

    res &&
      setData((prevState) =>
        updateNodeByPath(prevState, selection?.path, res.data),
      );

    if (
      !selection?.path ||
      selection.kind === MenuDirectoryTreeRef.KindEnum.Folder
    )
      return;
    console.log(selection.path.replace(/\//g, '-').slice(1).replace(' ', '-'));
    navigate(
      '/dashboard/' +
        selection.path
          .replace(/\//g, '-')
          .slice(1)
          .replace(/\s+/g, '-')
          .toLocaleLowerCase(),
    );
  };

  return (
    <div className={`${openedSidebar ? 'active' : ''}` + ' sidebar'}>
      <div className="tree-view">
        {data && (
          <TreeView
            data={data}
            actionsMode={true}
            onSelect={handleSelect}
            onCreate={handleCreate}
          />
        )}
      </div>
      <ul className="sidebar__items-list">
        {deviceSize === 'sm' && (
          <li>
            <Form.Select
              className="sidebar__language-selector"
              defaultValue="en"
              onChange={handleLanguageChange}
            >
              <option value="en">English</option>
              <option value="ptBr">Português</option>
            </Form.Select>
          </li>
        )}
        <li>
          <button
            className="px-4 py-2 bg-white text-blue-500 border border-blue-500 rounded transition-colors"
            onClick={() => logout()}
          >
            Logout
          </button>
        </li>
        <li>
          <button
            className="px-4 py-2 bg-white text-blue-500 border border-blue-500 rounded transition-colors"
            type="button"
            onClick={() => onClickNavigate('/admin')}
          >
            {t('admin-panel')}
          </button>
        </li>
        <li>
          <Link to="/table/create">
            <button className="">Nova Entrada</button>
          </Link>
        </li>
      </ul>

      {dashboards &&
        dashboards.map((dashboard: Dashboard) => (
          <label
            onClick={() => {
              navigate('/dashboard');
              dispatch(setDashboardId({ id: dashboard.id }));
            }}
            key={dashboard.id}
          >
            {dashboard.name}
          </label>
        ))}
    </div>
  );
};

export default Sidebar;
