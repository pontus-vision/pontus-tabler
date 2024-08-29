import React, { useContext } from 'react';

import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Form from 'react-bootstrap/esm/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/esm/Button';
import { AuthContext, useAuth } from '../AuthContext';

const Header = ({ setOpenedSidebar, openedSidebar }: HeaderProps) => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useContext(AuthContext);
  const { i18n } = useTranslation();

  const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;
    i18n.changeLanguage(selectedLanguage);
  };

  if(!isAuthenticated) return

  return (
    <div className="header absolute">
      <Form.Select
        data-testid="language-select"
        className="header__language-selector"
        defaultValue="en"
        onChange={handleLanguageChange}
      >
        <option value="en">English</option>
        <option value="ptBr">Português</option>
      </Form.Select>
      <label
        className={`header__hamburguer-menu ${openedSidebar ? 'active' : ''}`}
      >
        <input
          data-testid="toggle-input"
          checked={openedSidebar}
          onClick={(e: any) => {
            setOpenedSidebar(e.target.checked);
          }}
          type="checkbox"
        />
      </label>
      <img
        data-testid="header-logo"
        className={`header__logo ${openedSidebar ? 'active' : ''}`}
        onClick={() => navigate('/')}
        src="/src/assets/pontus-logo.png"
      />
    </div>
  );
};

type HeaderProps = {
  setOpenedSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  openedSidebar: boolean;
};

export default Header;
