import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import Button from 'react-bootstrap/esm/Button';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { RootState } from '../store/store';
import { useTranslation } from 'react-i18next';
import Form from 'react-bootstrap/esm/Form';
import { Dashboard, DataRoot } from '../types';
import { setDashboardId } from '../store/sliceDashboards';
import { useAuth } from '../AuthContext';
import TreeView from './Tree/TreeView';
import { readMenu } from '../client';
import data from './Tree/data';

type Props = {
  openedSidebar: boolean;
  setOpenedSidebar: Dispatch<SetStateAction<boolean>>;
};

const Sidebar = ({ openedSidebar, setOpenedSidebar }: Props) => {
  const [models, setModels] = useState() as any[];
  const [showForms, setShowForms] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [dashboardsData, setDashboardsData] = useState<DataRoot>(data);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { value: dashboards } = useSelector((state: RootState) => {
    return state.dashboards;
  });
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await readMenu();

        // res && setDashboardsData(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMenu();
  }, []);

  const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;
    i18n.changeLanguage(selectedLanguage);
  };

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
    <div className={`${openedSidebar ? 'active' : ''} sidebar`}>
      <div className="sidebar-content">
        {dashboardsData && <TreeView data={dashboardsData} />}
      </div>
      <ul className="list-none p-0 m-0">
        {deviceSize === 'sm' && (
          <li>
            <Form.Select
              className="sidebar-language-selector"
              defaultValue="en"
              onChange={handleLanguageChange}
            >
              <option value="en">English</option>
              <option value="ptBr">Português</option>
            </Form.Select>
          </li>
        )}
        <li>
          <button className="sidebar-button" onClick={() => logout()}>
            Logout
          </button>
        </li>
        <li>
          <button
            className="sidebar-button"
            type="button"
            onClick={() => onClickNavigate('/admin')}
          >
            {t('admin-panel')}
          </button>
        </li>
        <li>
          <Link to="/table/create">
            <button className="sidebar-button">Nova Entrada</button>
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
            className="sidebar-label"
          >
            {dashboard.name}
          </label>
        ))}
    </div>
  );
};

export default Sidebar;
