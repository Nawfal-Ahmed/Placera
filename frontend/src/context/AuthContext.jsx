import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from token on mount
  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem('placera_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/auth/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        if (data.success && data.user) {
          setUser(data.user);
        } else {
          // Token is invalid/expired
          localStorage.removeItem('placera_token');
        }
      } catch (err) {
        console.error('Failed to verify token session:', err);
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, []);

  // Live Server Login
  const login = async (email, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (data.success) {
        localStorage.setItem('placera_token', data.token);
        setUser(data.user);
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.message || 'Authentication failed' };
      }
    } catch (err) {
      console.error('API login error:', err);
      return { success: false, error: 'Unable to connect to PLACERA API' };
    }
  };

  // Live Server Registration
  const register = async (userData) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();
      if (data.success) {
        localStorage.setItem('placera_token', data.token);
        setUser(data.user);
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.message || 'Registration failed' };
      }
    } catch (err) {
      console.error('API register error:', err);
      return { success: false, error: 'Unable to connect to PLACERA API' };
    }
  };

  // Sign out
  const logout = () => {
    setUser(null);
    localStorage.removeItem('placera_token');
  };

  // Live profile updater with database persistence
  const updateStudentProfile = async (updatedDetails) => {
    if (!user || user.role !== 'student') return { success: false, error: 'Not a student' };
    
    try {
      const token = localStorage.getItem('placera_token');
      const response = await fetch(`/api/auth/users/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ studentDetails: updatedDetails })
      });

      const data = await response.json();
      if (data.success && data.user) {
        setUser(data.user);
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.message || 'Failed to update profile' };
      }
    } catch (err) {
      console.error('API profile update error:', err);
      return { success: false, error: 'Unable to connect to PLACERA API' };
    }
  };

  // Live profile updater for all users
  const updateUserProfile = async (updatedUserFields) => {
    if (!user) return { success: false, error: 'No active session' };
    
    try {
      const token = localStorage.getItem('placera_token');
      const response = await fetch(`/api/auth/users/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedUserFields)
      });

      const data = await response.json();
      if (data.success && data.user) {
        setUser(data.user);
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.message || 'Failed to update profile' };
      }
    } catch (err) {
      console.error('API user profile update error:', err);
      return { success: false, error: 'Unable to connect to PLACERA API' };
    }
  };

  // Live delete account helper
  const deleteUserAccount = async () => {
    if (!user) return { success: false, error: 'No active session' };
    try {
      const token = localStorage.getItem('placera_token');
      const response = await fetch(`/api/auth/users/${user._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        logout();
        return { success: true };
      } else {
        return { success: false, error: data.message || 'Failed to delete account' };
      }
    } catch (err) {
      console.error('API delete account error:', err);
      return { success: false, error: 'Unable to connect to PLACERA API' };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, updateStudentProfile, updateUserProfile, deleteUserAccount }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
