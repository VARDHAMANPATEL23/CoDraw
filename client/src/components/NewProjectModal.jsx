import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { saveProjectToDB } from '../db/projectDB';
import { useCanvasStore } from '../store/useCanvasStore';

export default function NewProjectModal({ isOpen, onClose, onProjectCreated }) {
  const [name, setName] = useState('My Web App');
  const [language, setLanguage] = useState('js');
  const [stylingSystem, setStylingSystem] = useState('tailwind');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const projectId = uuidv4();
    const newProjectJSON = {
      meta: {
        projectId,
        name: name.trim() || 'My Web App',
        version: '1.0',
        framework: 'react-cra',
        language,
        stylingSystem,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      canvas: {
        width: 1440,
        gridSize: 8,
        components: [],
      },
    };

    await saveProjectToDB(newProjectJSON);
    useCanvasStore.setState({
      meta: newProjectJSON.meta,
      components: [],
      selectedId: null,
      past: [],
      future: [],
    });

    if (onProjectCreated) onProjectCreated(newProjectJSON);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-md p-6 text-slate-200">
        <h2 className="text-lg font-bold text-slate-100 mb-4">Create New Project</h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Project Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., My Portfolio"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Export Language (Immutable)
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'js', label: 'JavaScript (.jsx)' },
                { id: 'ts', label: 'TypeScript (.tsx)' },
              ].map((lang) => (
                <label
                  key={lang.id}
                  className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                    language === lang.id
                      ? 'bg-indigo-950/60 border-indigo-500 text-indigo-200'
                      : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="language"
                    value={lang.id}
                    checked={language === lang.id}
                    onChange={() => setLanguage(lang.id)}
                    className="hidden"
                  />
                  <span className="text-xs font-medium">{lang.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Styling System
            </label>
            <div className="space-y-2">
              {[
                { id: 'tailwind', label: 'Tailwind CSS' },
                { id: 'css-modules', label: 'Plain CSS / CSS Modules' },
                { id: 'bootstrap', label: 'Bootstrap 5' },
              ].map((sys) => (
                <label
                  key={sys.id}
                  className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                    stylingSystem === sys.id
                      ? 'bg-indigo-950/60 border-indigo-500 text-indigo-200'
                      : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="stylingSystem"
                    value={sys.id}
                    checked={stylingSystem === sys.id}
                    onChange={() => setStylingSystem(sys.id)}
                    className="hidden"
                  />
                  <span className="text-xs font-medium">{sys.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-lg"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
