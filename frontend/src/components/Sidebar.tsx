import {
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  ChangeEvent,
} from 'react';
import Button from 'react-bootstrap/esm/Button';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

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
  MenuItemTreeRef,
  MenuReadRes,
} from '../pontus-api/typescript-fetch-client-generated';
import MenuTree from './MenuTree';

type Props = {
  openedSidebar: boolean;
  setOpenedSidebar: Dispatch<SetStateAction<boolean>>;
};

const Sidebar = ({ openedSidebar, setOpenedSidebar }: Props) => {
  const [models, setModels] = useState() as any[];
  const [showForms, setShowForms] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [openAdminOptions, setOpenAdminOptions] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { value: dashboards } = useSelector((state: RootState) => {
    return state.dashboards;
  });
  const { t, i18n } = useTranslation();

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

  const handleLanguageChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedLanguage = event.target.value;
    i18n.changeLanguage(selectedLanguage);
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

  return (
    <div className={`${openedSidebar ? 'active' : ''}` + ' sidebar'}>
      <MenuTree />
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
            onClick={() => setOpenAdminOptions(!openAdminOptions)}
          >
            {t('admin-panel')}
          </button>
          {openAdminOptions && (
            <ul>
              <li onClick={() => navigate('/dashboards')}>Dashboards</li>
              <li onClick={() => navigate('/auth/groups')}>Auth Groups</li>
            </ul>
          )}
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
