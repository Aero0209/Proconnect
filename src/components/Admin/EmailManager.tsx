import React, { useState } from 'react';
import { db } from '../../firebase/config';
import { setDoc, doc } from 'firebase/firestore';

export default function EmailManager() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const authorizeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await setDoc(doc(db, 'authorizedEmails', email), {
        authorized: true,
        addedAt: new Date(),
        isAdmin: false
      });
      setEmail('');
      setSuccess(true);
    } catch (error) {
      console.error("Erreur d'autorisation:", error);
      setError("Erreur lors de l'ajout de l'email");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Gestion des emails autorisés
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          Email autorisé avec succès
        </div>
      )}

      <form onSubmit={authorizeEmail} className="space-y-4">
        <div>
          <label 
            htmlFor="email" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email à autoriser
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="exemple@domaine.com"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`
            w-full px-4 py-2 text-white rounded-md
            ${isLoading ? 'bg-gray-400' : 'bg-primary hover:bg-primary-dark'}
            transition-colors
          `}
        >
          {isLoading ? 'Autorisation...' : 'Autoriser'}
        </button>
      </form>
    </div>
  );
} 