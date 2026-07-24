import React, { useEffect, useState } from 'react';
import { getAllProjectsFromDB, deleteProjectFromDB, saveProjectToDB } from '../db/projectDB';
import { useAuthStore } from '../store/useAuthStore';
import { useOfflineSync } from '../hooks/useOfflineSync';
import AuthModal from './AuthModal';

export default function ProjectDashboard({ onOpenProject, onNewProjectClick }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const { user, isAuthenticated, logout } = useAuthStore();
  const { isOnline, mergeCloudProjects } = useOfflineSync();

  const loadProjects = async () => {
    setLoading(true);
    try {
      const merged = await mergeCloudProjects();
      setProjects(merged);
    } catch (err) {
      console.error('Failed to load projects:', err);
      const local = await getAllProjectsFromDB();
      setProjects(local);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [isAuthenticated, isOnline]);

  const handleDelete = async (projectId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this project?')) {
      await deleteProjectFromDB(projectId);
      loadProjects();
    }
  };

  const handleDuplicate = async (project, e) => {
    e.stopPropagation();
    const duplicatedJSON = JSON.parse(JSON.stringify(project));
    const newId = crypto.randomUUID();
    duplicatedJSON.meta.projectId = newId;
    duplicatedJSON.meta.name = `${project.meta.name} (Copy)`;
    duplicatedJSON.meta.createdAt = new Date().toISOString();
    duplicatedJSON.meta.updatedAt = new Date().toISOString();

    await saveProjectToDB(duplicatedJSON);
    loadProjects();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between border-b border-slate-800 pb-6 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              CoDraw Dashboard
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Browser-based visual React website builder
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <div
              className={`flex items-center space-x-1.5 text-xs font-medium ${
                isOnline ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isOnline ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
                }`}
              ></span>
              <span>{isOnline ? 'Online' : 'Offline Mode'}</span>
            </div>

            {isAuthenticated ? (
              <div className="flex items-center space-x-3 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-xs">
                <span className="text-slate-300 font-medium">{user?.email}</span>
                <button
                  onClick={logout}
                  className="text-red-400 hover:text-red-300 font-bold"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="bg-indigo-950 hover:bg-indigo-900 border border-indigo-700/60 text-indigo-300 font-semibold text-xs px-3 py-1.5 rounded-lg transition-colors"
              >
                Sign In / Register
              </button>
            )}

            <button
              onClick={onNewProjectClick}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-lg transition-all flex items-center space-x-2"
            >
              <span>+ New Project</span>
            </button>
          </div>
        </header>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-500 text-sm">
            Loading projects...
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-2xl">
            <h3 className="text-lg font-medium text-slate-300">No projects yet</h3>
            <p className="text-slate-500 text-sm mt-1 mb-6">
              Create your first CoDraw project to get started with drag-and-drop building.
            </p>
            <button
              onClick={onNewProjectClick}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-4 py-2 rounded-lg"
            >
              Create New Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((proj) => {
              const meta = proj.meta || {};
              return (
                <div
                  key={meta.projectId}
                  onClick={() => onOpenProject(proj)}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 cursor-pointer transition-all hover:shadow-xl flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-slate-100 group-hover:text-indigo-400 transition-colors">
                        {meta.name}
                      </h3>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">
                        {meta.language}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-slate-500 mb-4">
                      <span>Styling: {meta.stylingSystem}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-800/80 pt-4 mt-2">
                    <span className="text-[11px] text-slate-500">
                      Updated {new Date(meta.updatedAt).toLocaleDateString()}
                    </span>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => handleDuplicate(proj, e)}
                        className="text-xs text-slate-400 hover:text-slate-200 px-2 py-1 rounded bg-slate-800/60 hover:bg-slate-800"
                        title="Duplicate Project"
                      >
                        Duplicate
                      </button>
                      <button
                        onClick={(e) => handleDelete(meta.projectId, e)}
                        className="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded bg-red-950/30 hover:bg-red-950/60"
                        title="Delete Project"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showAuthModal && (
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      )}
    </div>
  );
}
