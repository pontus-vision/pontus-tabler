import React, { useContext, useEffect } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Form from 'react-bootstrap/esm/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/esm/Button';
import { AuthContext, useAuth } from '../AuthContext';
import useLogin from '../hooks/useLogin';

const Header = ({ setOpenedSidebar, openedSidebar }: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation()
  const { isAuthenticated, logout } = useContext(AuthContext);
  const { i18n } = useTranslation();

  const { loading } = useLogin()

  const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;
    i18n.changeLanguage(selectedLanguage);
  };


  if (location.pathname.endsWith('login') || location.pathname.endsWith('register/admin')) return
  if (!isAuthenticated) return

  return (
    <div data-cy="header" className="header absolute">
      {/*<Form.Select
        data-testid="language-select"
        className="header__language-selector"
        defaultValue="en"
        onChange={handleLanguageChange}
      >
        <option value="en">English</option>
        <option value="ptBr">Português</option>
      </Form.Select>*/}
      <label
        data-cy="burguer-menu-input"
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
      <button
        className="logout-btn "
        onClick={() => logout()}
      >
        Logout
      </button>
    </div>
  );
};

type HeaderProps = {
  setOpenedSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  openedSidebar: boolean;
};

export default Header;
