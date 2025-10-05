import { useEffect, useRef, useState } from 'react';
import { loginUser, registerAdmin, registerUser } from '../client';
import useApiAndNavigate from '../hooks/useApi';
import { useNavigate } from 'react-router-dom';
import {
  RegisterAdminReq,
  RegisterUserReq,
  RegisterUserRes,
} from '../typescript/api';
import { AxiosResponse } from 'axios';
import { useAuth } from '../AuthContext';
import NotificationManager, {
  MessageRefs,
} from '../components/NotificationManager';
import {
  TableColumnRef,
  TableRef,
  TableUpdateReq,
} from '../../typescript/api';
import useLogin from '../hooks/useLogin';

type Props = {
  adminRoute?: boolean;
  notificationManagerRef?: React.RefObject<MessageRefs>;
};

const RegisterView = ({ adminRoute, notificationManagerRef }: Props) => {
  const [passwd, setPasswd] = useState('');
  const [passwdConfirmation, setPasswdConfirmation] = useState('');
  const [username, setUsername] = useState('');
  const { login } = useAuth();

  const { fetchDataAndNavigate } = useApiAndNavigate();
  const navigate = useNavigate();
  const { handleLogin, loading } = useLogin();

  const [isRegistered, setIsRegistered] = useState(false)

  const register = async () => {
    const obj: RegisterUserReq | RegisterAdminReq = {
      username,
      password: passwd,
      passwordConfirmation: passwdConfirmation,
    };

    if (adminRoute) {
      try {

        const res = await registerAdmin(obj);

        if (res.status === 200) {
          handleLogin(username, passwd);
          setIsRegistered(true)
          notificationManagerRef?.current?.addMessage('success', 'Success', 'Admin is registered.');
          navigate('/tables/read');
        }
      } catch (error) {
        notificationManagerRef?.current?.addMessage('error', 'Error', JSON.stringify(error));
      }
    } else {
      const res = (await fetchDataAndNavigate(
        registerUser,
        obj,
        '/tables/read'
      )) as AxiosResponse<RegisterUserRes>;

      // if (res.status === 200) {
      //   handleLogin(username, passwd);
      //   navigate('/auth/users');
      // }
    }


  };
  return (
    <div className="container">
      <h2>{adminRoute ? 'Admin' : 'User'} Registration</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          register();
        }}
      >
        <div className="form-group">
          <label for="username">Username:</label>
          <input
            type="text"
            data-cy="username-input"
            onChange={(e) => setUsername(e.target.value)}
            id="username"
            name="username"
            required
          />
        </div>
        <div className="form-group">
          <label for="password">Password:</label>
          <input
            onChange={(e) => setPasswd(e.target.value as string)}
            data-cy="password-input"
            type="password"
            id="password"
            name="password"
            required
          />
        </div>
        <div className="form-group">
          <label for="password_confirm">Confirm Password:</label>
          <input
            onChange={(e) => setPasswdConfirmation(e.target.value)}
            type="password"
            data-cy="password-confirmation-input"
            id="password_confirm"
            name="password_confirm"
            required
          />
        </div>
        <div className="form-group">
          <input type="submit" value="Register" />
        </div>
      </form>
    </div>
  );
};

export default RegisterView;
