import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ChatContainer from './components/Chat/ChatContainer';
import LoginPage from './components/Login';
import { AuthProvider, useAuth } from './components/AuthContext';
import { Toaster } from 'react-hot-toast';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="bg-gray-100 flex items-center justify-center p-4"
      style={{ height: '100dvh',overflow:"hidden" }} 
    >
      <div
        className="w-full max-w-3xl sm:h-[600px] h-[calc(100dvh-16px)] rounded-lg overflow-hidden shadow-xl"
      >
        <Routes>
          <Route
            path="/"
            element={isAuthenticated ? <ChatContainer /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/login"
            element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" replace />}
          />
        </Routes>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
          <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#ef4444',
              color: '#fff',
            },
          }}
          />
      </AuthProvider>
    </Router>
  );
};

export default App;