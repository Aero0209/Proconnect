import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase/config';

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-primary">
            ProConnect
          </Link>
          
          {user && (
            <div className="flex items-center gap-4">
              <Link 
                to="/" 
                className="text-gray-600 hover:text-primary transition-colors"
              >
                Projets
              </Link>
              <Link 
                to="/admin" 
                className="text-gray-600 hover:text-primary transition-colors"
              >
                Admin
              </Link>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{user.email}</span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 text-sm text-red-500 hover:bg-red-50 rounded-md transition-colors"
                >
                  Déconnexion
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
} 