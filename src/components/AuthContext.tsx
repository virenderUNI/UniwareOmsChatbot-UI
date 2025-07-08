import React, { createContext, useState, useEffect, useContext } from 'react';
import { ENDPOINTS } from '../api/endpoints';

interface AuthContextType {
  userId: string | null;
  tenantCode: string | null;
  sessionId: string | null;
  isAuthenticated: boolean;
  login: (userId: string, tenantCode: string, sessionId: string) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userId, setUserId] = useState<string | null>(localStorage.getItem('userId') || null);
  const [tenantCode, setTenantCode] = useState<string | null>(localStorage.getItem('tenantCode') || 'stguat');
  const [sessionId, setSessionId] = useState<string | null>(localStorage.getItem('chatSessionId') || null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('userId'));

  useEffect(() => {
    fetchUserInfo().then(({ userId, tenantCode, sessionId}) => {
      if (userId && tenantCode && sessionId) {
        setUserId(userId);
        setTenantCode(tenantCode);
        setSessionId(sessionId);
        setIsAuthenticated(true);
        localStorage.setItem('userId', userId);
        localStorage.setItem('tenantCode', tenantCode);
        localStorage.setItem('chatSessionId', sessionId);
      } else {
        setUserId(null);
        setTenantCode(null);
        setSessionId(null);
        setIsAuthenticated(false);
        localStorage.removeItem('userId');
        localStorage.removeItem('chatSessionId');
      }
    }).catch((err) => {
      console.error('fetchUserInfo Error:', err);
      setUserId(null);
      setTenantCode(localStorage.getItem('tenantCode') || 'stguat');
      setSessionId(null);
      setIsAuthenticated(false);
      localStorage.removeItem('userId');
      localStorage.removeItem('chatSessionId');
    });
  }, [tenantCode]);

  const login = (userId: string, tenantCode: string, sessionId: string) => {
    setUserId(userId);
    setTenantCode(tenantCode);
    setSessionId(sessionId);
    setIsAuthenticated(true);
    localStorage.setItem('userId', userId);
    localStorage.setItem('tenantCode', tenantCode);
    localStorage.setItem('chatSessionId', sessionId);
  };

  const logout = async () => {
    try {
      await fetch('https://r28fisu1gi.execute-api.ap-south-1.amazonaws.com/api/auth/logout', {
        method: 'POST',
        headers: {
          'x-tenant-code': tenantCode || 'stguat',
          'x-user-id': userId || '',
          'x-chat-session-id': sessionId || ''
        }
      });
    } finally {
      setUserId(null);
      setTenantCode(null);
      setSessionId(null);
      setIsAuthenticated(false);
      localStorage.removeItem('userId');
      localStorage.removeItem('tenantCode');
      localStorage.removeItem('chatSessionId');
    }
  };

const fetchUserInfo = async (): Promise<{ userId: string | null, tenantCode: string | null, sessionId: string | null }> => {
    try {
      const defaultTenantCode = tenantCode || localStorage.getItem('tenantCode') || 'stguat';
      const storedSessionId = localStorage.getItem('chatSessionId') || '';
      const storedUserId = userId || localStorage.getItem('userId') || '';
      const response = await fetch(ENDPOINTS.SESSION, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-tenant-code': defaultTenantCode,
          'x-chat-session-id': storedSessionId,
          'x-user-id': storedUserId,
        }
      });
      if (response.ok) {
        const data = await response.json();
        console.log('fetchUserInfo Response:', data);
        const sessionIdFromResponse = data.sessionId || storedSessionId;
        const userIdFromResponse = data.userId || storedUserId;
        return {
          userId: userIdFromResponse,
          tenantCode: defaultTenantCode,
          sessionId: sessionIdFromResponse
        };
      }
      return { userId: null, tenantCode: defaultTenantCode, sessionId: null};
    } catch (err) {
      console.error('fetchUserInfo Fetch Error:', err);
      return { userId: null, tenantCode: tenantCode || localStorage.getItem('tenantCode') || 'stguat', sessionId: null};
    }
  };

  return (
    <AuthContext.Provider value={{ userId, tenantCode, sessionId, isAuthenticated, login, logout }}>
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