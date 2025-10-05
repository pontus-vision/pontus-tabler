import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthGroupRef } from './typescript/api';
import { loginUser, readUserGroups } from './client';
import useLogin from './hooks/useLogin';
import { getUserIdFromToken } from '../utils';

interface AuthContextType {
  isAuthenticated: boolean;
  userGroups: AuthGroupRef[];
  login: (role: string) => void;
  logout: () => void;
}
export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  userGroups: [],
  login: () => { },
  logout: () => { },
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userGroups, setUserGroups] = useState<AuthGroupRef[]>([]);

  const { handleLogin } = useLogin();

  const navigate = useNavigate();

  const login = async (userId: string) => {
    setIsAuthenticated(true);

    try {
      const res = await readUserGroups({ id: userId, filters: {} });

      setUserGroups(res?.data?.authGroups || []);
      if (location.pathname === '/login') {
        navigate('/tables/read');
      }
    } catch (error) {
      console.error({ error })
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserGroups([]);
    navigate('/login');

    localStorage.removeItem('accessToken');
  };

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken && userGroups.length === 0) {
      const userId = getUserIdFromToken();

      login(userId);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userGroups,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
