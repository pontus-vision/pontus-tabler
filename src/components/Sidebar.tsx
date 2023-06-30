import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import Button from 'react-bootstrap/esm/Button';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { RootState } from '../store/store';
import { useTranslation } from 'react-i18next';
import Form from 'react-bootstrap/esm/Form';

type Props = {
  openedSidebar: boolean;
  setOpenedSidebar: Dispatch<SetStateAction<boolean>>;
  setDashboardId: Dispatch<SetStateAction<string | undefined>>;
};

const Sidebar = ({
  openedSidebar,
  setDashboardId,
  setOpenedSidebar,
}: Props) => {
  const [models, setModels] = useState() as any[];
  const [showForms, setShowForms] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
    <div className={`${openedSidebar ? 'active' : ''}` + ' sidebar'}>
      {deviceSize === 'sm' && (
        <Form.Select
          className="sidebar__language-selector"
          defaultValue="en"
          onChange={handleLanguageChange}
        >
          <option value="en">English</option>
          <option value="ptBr">Português</option>
        </Form.Select>
      )}
      <Button
        className="sidebar__admin-btn"
        type="button"
        onClick={() => onClickNavigate('/admin')}
      >
        {t('admin-panel')}
      </Button>

      {dashboards &&
        dashboards.map((dashboard) => (
          <label
            onClick={() => {
              navigate('/dashboard');
              setDashboardId(dashboard.id);
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
