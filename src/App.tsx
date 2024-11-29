import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { auth } from './firebase/config';
import Navbar from './components/Layout/Navbar';
import PrivateRoute from './components/Auth/PrivateRoute';
import Login from './components/Auth/Login';
import ProjectList from './components/Projects/ProjectList';
import Chat from './components/Chat/Chat';
import EmailManager from './components/Admin/EmailManager';

function App() {
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(() => {
      setInitializing(false);
    });

    return unsubscribe;
  }, []);

  if (initializing) {
    return <div>Chargement...</div>;
  }

  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="pt-16">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <ProjectList />
                  </PrivateRoute>
                }
              />
              <Route
                path="/project/:projectId/chat"
                element={
                  <PrivateRoute>
                    <Chat />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <PrivateRoute>
                    <EmailManager />
                  </PrivateRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App; 