import {
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  ChangeEvent,
  useContext,
} from 'react';
import Button from 'react-bootstrap/esm/Button';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { RootState } from '../store/store';
import { useTranslation } from 'react-i18next';
import Form from 'react-bootstrap/esm/Form';
import { Child, Dashboard, DataRoot } from '../types';
import { setDashboardId } from '../store/sliceDashboards';
import { AuthContext, useAuth } from '../AuthContext';
import TreeView from './Tree/TreeView';
import { createMenu, readMenu } from '../client';
import data from './Tree/data';
import { File, Folder } from './Tree/FolderItem';
import {
  MenuItemTreeRef,
  MenuReadRes,
} from '../pontus-api/typescript-fetch-client-generated';
import { IoMdSettings } from "react-icons/io";
import MenuTree from './MenuTree';

type Props = {
  openedSidebar: boolean;
  setOpenedSidebar: Dispatch<SetStateAction<boolean>>;
};

const Sidebar = ({ openedSidebar, setOpenedSidebar }: Props) => {
  const [models, setModels] = useState() as any[];
  const [showForms, setShowForms] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [openDashboards, setOpenDashboards] = useState(false);
  const [openAuthGroups, setOpenAuthGroups] = useState(false);
  const [openAuthUsers, setOpenAuthUsers] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation()
  const { value: dashboards } = useSelector((state: RootState) => {
    return state.dashboards;
  });
  const { t, i18n } = useTranslation();


  const {
    isAuthenticated,
    userGroups: userRole,
    logout,
  } = useContext(AuthContext);
  const [tree, setTree] = useState({
    name: '/',
    kind: 'folder',
    path: '/',
    children: [],
  });


  useEffect(() => {
  }, []);

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

  if (!isAuthenticated) return;

  if (location.pathname.endsWith('login') || location.pathname.endsWith('register/admin')) return
  return (
    <div className={`${openedSidebar ? 'active' : ''}` + ' sidebar'}>
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
        <li className="sidebar__admin-options">
          <button
            className={`sidebar__btn`}
            type="button"
            onClick={() => {
              setOpenAuthGroups(!openAuthGroups)
              navigate('/auth/groups')
            }}
          >
            {t('Auth Groups')}
          </button>
        </li>
        <li className="sidebar__admin-options">
          <button
            className={`sidebar__btn`}
            type="button"
            onClick={() => {
              setOpenAuthGroups(!openAuthGroups)
              navigate('/tables/read')
            }}
          >
            {t('Tables')}
          </button>
        </li>
        <li className="sidebar__admin-options">
          <button
            className={`sidebar__btn `}
            type="button"
            onClick={() => {
              setOpenAuthUsers(!openAuthUsers)
              navigate('/auth/users')
            }}
          >
            {t('Auth Users')}
          </button>
        </li>
        <li className="sidebar__admin-options">
          <button
            className={`sidebar__btn ${openDashboards ? 'opened' : ''}`}
            type="button"
            onClick={() => {
              setOpenDashboards(true)
              navigate('/dashboards')
            }}
          >
            Dashboards
          </button>
          <div style={{ visibility: openDashboards ? 'visible' : 'hidden' }}>
            <MenuTree selectionOnly={false} />
          </div>
        </li>
        <li className="sidebar__admin-options">
          <button
            className={`sidebar__btn settings-btn`}
            type="button"
            onClick={() => {
              navigate('/settings')
            }}
          >
            <IoMdSettings />
            {t('Settings')}
          </button>
        </li>
      </ul>

      {
        dashboards &&
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
        ))
      }
    </div >
  );
};

export default Sidebar;
