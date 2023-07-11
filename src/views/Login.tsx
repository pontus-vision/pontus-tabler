import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { Select } from 'semantic-ui-react';
import FormSelect from 'react-bootstrap/esm/FormSelect';

const LoginPage = () => {
  const { login } = useAuth();
  const [role, setRole] = useState('admin');

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = () => {
    login(role);
  };

  useEffect(() => {
    console.log(role);
  }, [role]);

  return (
    <div>
      <h2>Login Page</h2>
      <select onChange={(e) => setRole(e.target.value)}>
        <option value="admin">Admin</option>
        <option value="user">User</option>
      </select>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default LoginPage;
