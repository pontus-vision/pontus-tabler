import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import Button from 'react-bootstrap/esm/Button';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { RootState } from '../store/store';
import { useTranslation } from 'react-i18next';
import Form from 'react-bootstrap/esm/Form';
import { Dashboard } from '../types';
import { setDashboardId } from '../store/sliceDashboards';
import { useAuth } from '../AuthContext';

type Props = {
  openedSidebar: boolean;
  setOpenedSidebar: Dispatch<SetStateAction<boolean>>;
};

const Sidebar = ({ openedSidebar, setOpenedSidebar }: Props) => {
  const [models, setModels] = useState() as any[];
  const [showForms, setShowForms] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { value: dashboards } = useSelector((state: RootState) => {
    return state.dashboards;
  });
  const { t, i18n } = useTranslation();

  useEffect(() => {
    console.log({ dashboards });
  }, [dashboards]);

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
    <div className={`top-12 ${openedSidebar ? 'active' : ''}` + ' sidebar'}>
      <ul className="list-none p-0 m-0">
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
            className="px-4 py-2 bg-white text-blue-500 border border-blue-500 rounded transition-colors hover:bg-blue-500 hover:text-white"
            onClick={() => logout()}
          >
            Logout
          </button>
        </li>
        <li>
          <button
            className="sidebar__admin-btn px-4 py-2 bg-white text-blue-500 border border-blue-500 rounded transition-colors hover:bg-blue-500 hover:text-white"
            type="button"
            onClick={() => onClickNavigate('/admin')}
          >
            {t('admin-panel')}
          </button>
        </li>
        <li>
          <Link to="/table/create">
            <button className="bg-blue-600">Nova Entrada</button>
          </Link>
        </li>
        <li>
          <button className="block uppercase text-blue-500 mx-auto shadow bg-slate-50 hover:bg-blue-500 focus:shadow-outline focus:outline-none text-white text-xs py-3 px-10 rounded">
            Sign in
          </button>
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
