import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import useApiAndNavigate from '../hooks/useApi';
import useLogin from '../hooks/useLogin';

const LoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  const [role, setRole] = useState('Admin');
  const [apiKeys, setApiKeys] = useState();
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const location = useLocation();

  const { fetchDataAndNavigate } = useApiAndNavigate();

  const { handleLogin, loading } = useLogin();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/tables/read')
    }
  }, [])

  const loginUser = async (e) => {
    e.preventDefault();

    handleLogin(username, password);
  }

  if (isAuthenticated) return

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
          <form onSubmit={loginUser}>
            <h3>Sign In</h3>
            <div className="mb-3">
              <label>Username</label>
              <input
                data-cy="username-login-input"
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                className="form-control"
                placeholder="Enter username"
              />
            </div>
            <div className="mb-3">
              <label>Password</label>
              <input
                data-cy="password-login-input"
                onChange={(e) => setPassword(e.target.value)}
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
