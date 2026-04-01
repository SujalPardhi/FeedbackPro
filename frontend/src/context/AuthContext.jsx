import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for user in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setAuthToken(parsedUser.token);
    }
    setLoading(false);
  }, []);

  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  const login = async (credentials) => {
    const res = await axios.post('/api/auth/login', credentials);
    setUser(res.data);
    setAuthToken(res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data));
    return res.data;
  };

  const register = async (userData) => {
    const res = await axios.post('/api/auth/register', userData);
    setUser(res.data);
    setAuthToken(res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data));
    return res.data;
  };

  const logout = () => {
    setUser(null);
    setAuthToken(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
