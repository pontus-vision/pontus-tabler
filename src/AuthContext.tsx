import { createContext, useContext, useEffect, useState } from 'react';
import { useLocalStorage } from './UseLocalStorage';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: string | null;
  login: (role: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  userRole: null,
  login: () => {},
  logout: () => {},
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [token, setToken] = useState();
  const navigate = useNavigate();

  const login = (role: string) => {
    setIsAuthenticated(true);
    setUserRole(role);
  };

  useEffect(() => {
    if (userRole === 'Admin') {
      navigate('/admin');
    } else if (userRole === 'User') {
      navigate('/dashboard');
    }
  }, [userRole]);

  useEffect(() => {
    if (userRole) {
      localStorage.setItem('userRole', JSON.stringify(userRole));
    }
  }, [userRole]);

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    navigate('/login');

    localStorage.removeItem('userRole');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userRole,
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
