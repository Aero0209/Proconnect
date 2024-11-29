import React, { useState } from 'react';
import { createProject } from '../../firebase/config';

interface NewProjectProps {
  onProjectCreated: (projectId: string) => void;
}

interface ProjectFormData {
  name: string;
  siteUrl: string;
  githubUrl: string;
  description: string;
}

export default function NewProject({ onProjectCreated }: NewProjectProps) {
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    siteUrl: '',
    githubUrl: '',
    description: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const projectId = await createProject(formData);
      setFormData({ name: '', siteUrl: '', githubUrl: '', description: '' });
      if (onProjectCreated) onProjectCreated(projectId);
    } catch (error) {
      console.error("Erreur lors de la création du projet:", error);
      alert("Erreur lors de la création du projet");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h3 className="text-xl font-semibold mb-6">Nouveau Projet</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nom du projet
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        
        <div>
          <label htmlFor="siteUrl" className="block text-sm font-medium text-gray-700 mb-1">
            URL du site
          </label>
          <input
            type="url"
            id="siteUrl"
            name="siteUrl"
            value={formData.siteUrl}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        
        <div>
          <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-700 mb-1">
            URL GitHub
          </label>
          <input
            type="url"
            id="githubUrl"
            name="githubUrl"
            value={formData.githubUrl}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
          {isLoading ? 'Création...' : 'Créer le projet'}
        </button>
      </form>
    </div>
  );
} 