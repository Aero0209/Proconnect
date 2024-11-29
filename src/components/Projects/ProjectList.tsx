import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase/config';
import { collection, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import NewProject from './NewProject';

interface Project {
  id: string;
  name: string;
  description?: string;
  siteUrl: string;
  githubUrl: string;
  createdAt: Timestamp;
  createdByEmail: string;
}

export default function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showNewProject, setShowNewProject] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(
      collection(db, 'projects'),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projectsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Project[];
      setProjects(projectsData);
    });

    return () => unsubscribe();
  }, []);

  const handleChatClick = (projectId: string) => {
    navigate(`/project/${projectId}/chat`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8 p-4 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold text-gray-800">Projets en cours</h2>
        <button
          onClick={() => setShowNewProject(!showNewProject)}
          className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-opacity-90 transition-colors"
        >
          {showNewProject ? 'Fermer' : 'Nouveau Projet'}
        </button>
      </div>

      {showNewProject && (
        <NewProject onProjectCreated={() => setShowNewProject(false)} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <div 
            key={project.id} 
            className="bg-white rounded-lg shadow-md p-6 flex flex-col hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
            
            {project.description && (
              <p className="text-gray-600 text-sm mb-4">{project.description}</p>
            )}
            
            <div className="text-xs text-gray-500 flex justify-between mb-4">
              <span>Par {project.createdByEmail}</span>
              <span>
                {project.createdAt?.toDate().toLocaleDateString()}
              </span>
            </div>
            
            <div className="flex gap-2 mb-4">
              <a
                href={project.siteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm"
              >
                Voir le site
              </a>
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm"
              >
                GitHub
              </a>
            </div>
            
            <button
              onClick={() => handleChatClick(project.id)}
              className="mt-auto px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
            >
              Voir la conversation
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 