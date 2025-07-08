import React, { useState } from 'react';
import toast from 'react-hot-toast';
import logo from '../assets/unicommerce.svg';
import { useAuth } from './AuthContext';
import { ENDPOINTS } from '../api/endpoints';

interface LoginResponse {
  userId?: string;
  sessionId?: string;
  detail?: string;
  message?: string;
}

const LoginPage: React.FC = () => {
  const [tenantCode, setTenantCode] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantCode, username, password }),
      });
      const data: LoginResponse = await response.json();

      if (response.ok && data.userId && data.sessionId) {
        login(data.userId, tenantCode, data.sessionId);
      } else {
        throw new Error(data.detail || 'Invalid credentials');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect to server';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="text-white pr-4 pl-4 flex items-center" style={{ background: 'linear-gradient(to right, #e3f3f9, #1f87c2)' }}>
        <img src={logo} alt="Uniware Logo" className="h-20 w-20 mr-2 rounded" loading="lazy" />
      <h2 className="text-lg font-semibold" style={{ color: '#212121' }}>
        Uniware OMS Login
      </h2>
      </div>
      <div className="flex-grow p-6 flex items-center justify-center">
        <div className="w-full max-w-sm">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="accountName" className="block text-sm font-medium text-gray-700">
                Account Name
              </label>
              <input
                id="accountName"
                type="text"
                value={tenantCode}
                onChange={(e) => setTenantCode(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-customblue hover:bg-customblue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin mr-2"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M12 18V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M4.93 4.93L7.76 7.76" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M16.24 16.24L19.07 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M2 12H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M18 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M4.93 19.07L7.76 16.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M16.24 7.76L19.07 4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  Logging in...
                </div>
              ) : (
                'Log In'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
