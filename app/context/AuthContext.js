'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '../utils/GlobalAPI';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check for user in cookies on initial load
    const storedUser = Cookies.get('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        Cookies.remove('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, email, password) => {
    try {
      console.log('AuthContext - Attempting login with:', { 
        username, 
        email, 
        password: password ? '****' : 'empty'
      });

      if (!username || !email || !password) {
        throw new Error('All credentials are required');
      }

      const result = await loginUser(username, email, password);
      console.log('AuthContext - Login result:', result);

      if (result.success) {
        // Create user data object from the response
        const userData = {
          username: result.userData?.username || username,
          email: result.userData?.email || email,
          role: result.role,
          ...result.userData
        };

        console.log('AuthContext - User data:', userData);
        console.log('AuthContext - User role:', userData.role);

        // Store user data in cookies
        Cookies.set('user', JSON.stringify(userData), { expires: 7 }); // Expires in 7 days
        if (result.token) {
          Cookies.set('token', result.token, { expires: 7 });
        }
        
        // Update state
        setUser(userData);
        setIsAuthenticated(true);
        setLoading(false);

        // Redirect to appropriate dashboard
        router.push(`/dashboard/${userData.role.toLowerCase()}`);

        return {
          success: true,
          user: userData
        };
      } else {
        throw new Error(result.error || 'Login failed');
      }
    } catch (error) {
      console.error('AuthContext - Login error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  };

  const logout = () => {
    Cookies.remove('user');
    Cookies.remove('token');
    setUser(null);
    setIsAuthenticated(false);
    router.push('/login');
  };

  const getUser = () => {
    return user;
  };

  const getRole = () => {
    return user?.role;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        login,
        logout,
        getUser,
        getRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 