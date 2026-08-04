import React, { useState } from 'react';
import { useCanvasStore } from '../store/useCanvasStore';
import LivePreviewModal from './LivePreviewModal';
import AuthModal from './AuthModal';
import { exportProject } from '../engine';
import { useAuthStore } from '../store/useAuthStore';
import { useOfflineSync } from '../hooks/useOfflineSync';

export default function TopBar({ onBackToDashboard }) {
  const { meta, components, undo, redo, past, future } = useCanvasStore();
  const [showPreview, setShowPreview] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const { user, isAuthenticated, logout } = useAuthStore();
  const { isOnline } = useOfflineSync();

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const currentJSON = {
        meta,
        canvas: {
          width: 1440,
          gridSize: 8,
          components,
        },
      };
      await exportProject(currentJSON);
    } catch (err) {
      console.error('Export error:', err);
      alert('Failed to export project: ' + err.message);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <header className="h-14 bg-slate-900 border-b border-slate-800 text-slate-100 px-6 flex items-center justify-between z-20 select-none">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBackToDashboard}
            className="flex items-center space-x-2 text-indigo-400 hover:text-indigo-300 font-bold transition-colors"
            title="Back to Dashboard"
          >
            <span className="text-xl">CoDraw</span>
          </button>
          <span className="text-slate-700">|</span>
          <h1 className="text-sm font-semibold text-slate-200">{meta.name || 'My Project'}</h1>
        </div>

        <div className="flex items-center space-x-2">
          <button
            disabled={past.length === 0}
            onClick={undo}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 rounded text-xs text-slate-300 font-medium transition-colors"
          >
            Undo
          </button>
          <button
            disabled={future.length === 0}
            onClick={redo}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 rounded text-xs text-slate-300 font-medium transition-colors"
          >
            Redo
          </button>
          <span className="text-slate-700">|</span>
          <button
            onClick={() => setShowPreview(true)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-xs text-slate-300 font-medium transition-colors"
          >
            Preview
          </button>
          <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-xs text-slate-300 font-medium transition-colors">
            Save
          </button>
          <button
            disabled={isExporting}
            onClick={handleExport}
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded text-xs font-semibold text-white shadow transition-all flex items-center space-x-1"
          >
            {isExporting ? <span>Exporting...</span> : <span>Export</span>}
          </button>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <span className="bg-slate-800 border border-slate-700 text-slate-300 px-2 py-0.5 rounded font-mono uppercase">
            {meta.language || 'JS'}
          </span>

          {isAuthenticated ? (
            <div className="flex items-center space-x-2 bg-slate-800 border border-slate-700 px-2.5 py-1 rounded text-slate-300">
              <span className="text-[11px] font-medium text-slate-300">{user?.email}</span>
              <button
                onClick={async () => { await logout(); onBackToDashboard(); }}
                className="text-[10px] text-red-400 hover:text-red-300 font-bold ml-1"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-indigo-950 hover:bg-indigo-900 border border-indigo-700/60 text-indigo-300 font-semibold px-3 py-1 rounded transition-colors"
            >
              Sign In
            </button>
          )}

          <div
            className={`flex items-center space-x-1.5 font-medium ${
              isOnline ? 'text-emerald-400' : 'text-amber-400'
            }`}
            title={isOnline ? 'Connected' : 'Offline - Changes saved locally'}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isOnline ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
              }`}
            ></span>
            <span>{isOnline ? 'Online' : 'Offline'}</span>
          </div>
        </div>
      </header>

      {showPreview && <LivePreviewModal onClose={() => setShowPreview(false)} />}
      {showAuthModal && <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />}
    </>
  );
}
