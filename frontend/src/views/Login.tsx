import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { Select } from 'semantic-ui-react';
import FormSelect from 'react-bootstrap/esm/FormSelect';
import { listApiKeys } from '../webinyApi';
import { useDispatch } from 'react-redux';
import { defineConfig } from 'vite';
import { getApiKeys } from '../client';

const LoginPage = () => {
  const { login } = useAuth();
  const [role, setRole] = useState('Admin');
  const [apiKeys, setApiKeys] = useState();
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('click');
    login(role);
  };

  useEffect(() => {
    const func = async () => {
      const { data } = await getApiKeys();
      console.log({ data });
      setApiKeys(data);
    };
    func();
  }, []);

  const setSelectedApiKey = (apiKey: string) => {
    apiKey = JSON.parse(apiKey);
    setRole(apiKey.name);
    import.meta.env.VITE_WEBINY_API_TOKEN = apiKey.token;
    console.log(import.meta.env.VITE_WEBINY_API_TOKEN);
  };

  useEffect(() => {
    console.log(role);
  }, [role]);

  return (
    <div className="login-page">
      <div className="login-form">
        <section className="welcome-msg">
          <img src="/src/assets/pontus-logo.png" alt="" />
          <h1>Welcome to the Pontus Vision Platform!</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Possimus
            ratione eius vel molestiae sit autem ipsa facere vitae quod commodi?
          </p>
        </section>
        <section className="form">
          <select onChange={(e) => setSelectedApiKey(e.target.value)}>
            {apiKeys &&
              apiKeys.map((api) => (
                <option value={JSON.stringify(api)}>{api.name}</option>
              ))}
            <option value="Admin">Admin</option>
            <option value="User">User</option>
          </select>
          <form onSubmit={handleLogin}>
            <h3>Sign In</h3>
            <div className="mb-3">
              <label>Email address</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter email"
              />
            </div>
            <div className="mb-3">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
              />
            </div>
            <div className="mb-3">
              <div className="custom-control custom-checkbox">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id="customCheck1"
                />
                <label className="custom-control-label" htmlFor="customCheck1">
                  Remember me
                </label>
              </div>
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
            <p className="forgot-password text-right">
              Forgot <a href="#">password?</a>
            </p>
          </form>
        </section>
      </div>
    </div>
  );
};

export default LoginPage;
