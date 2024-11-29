import { useState } from 'react';
import { GoogleAuthProvider, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { auth, db } from '../../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          const user = result.user;
          
          // Vérifier si l'email est autorisé
          const userRef = doc(db, 'authorizedEmails', user.email);
          const userDoc = await getDoc(userRef);
          
          if (!userDoc.exists()) {
            await auth.signOut();
            setError("Votre email n'est pas autorisé à accéder à l'application.");
            return;
          }

          // Si tout est ok, rediriger vers la page principale
          navigate('/');
        }
      } catch (error) {
        console.error("Erreur de connexion:", error);
        setError("Erreur lors de la connexion. Veuillez réessayer.");
      } finally {
        setIsLoading(false);
      }
    };

    checkRedirectResult();
  }, [navigate]);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      // Utiliser signInWithRedirect au lieu de signInWithPopup
      await signInWithRedirect(auth, provider);
      
    } catch (error) {
      console.error("Erreur de connexion:", error);
      setError("Erreur lors de la connexion. Veuillez réessayer.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-primary to-primary-dark">
      <h1 className="text-4xl font-bold text-white mb-8 text-center shadow-text">
        ProConnect
      </h1>
      
      {error && (
        <div className="w-full max-w-md p-4 mb-4 bg-red-500 text-white rounded-md text-center">
          {error}
        </div>
      )}
      
      <button
        onClick={handleGoogleLogin}
        disabled={isLoading}
        className={`
          px-6 py-3 bg-white text-primary rounded-md
          font-medium shadow-lg transform transition-all
          ${!isLoading && 'hover:-translate-y-0.5 hover:shadow-xl'}
          ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        {isLoading ? 'Connexion en cours...' : 'Se connecter avec Google'}
      </button>
    </div>
  );
} 