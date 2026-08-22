import React, { useState } from 'react';
import { useCanvasStore } from '../store/useCanvasStore';
import LivePreviewModal from './LivePreviewModal';
import AuthModal from './AuthModal';
import { exportProject } from '../engine';
import { useAuthStore } from '../store/useAuthStore';
import { useOfflineSync } from '../hooks/useOfflineSync';
import { saveProjectToDB } from '../db/projectDB';

const Spinner = () => (
  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export default function TopBar({ onBackToDashboard }) {
  const { meta, components, undo, redo, past, future, isSplitView, toggleSplitView } = useCanvasStore();
  const [showPreview, setShowPreview] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  const { user, isAuthenticated, logout } = useAuthStore();
  const { isOnline } = useOfflineSync();

  const showToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'info' }), 3000);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const currentJSON = {
        meta: { ...meta, updatedAt: new Date().toISOString() },
        canvas: { width: 1440, gridSize: 8, components },
      };
      await saveProjectToDB(currentJSON);
      showToast('Project saved successfully!', 'success');
    } catch (err) {
      console.error('Save error:', err);
      showToast('Failed to save project.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

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
      showToast('Export complete! ZIP downloaded.', 'success');
    } catch (err) {
      console.error('Export error:', err);
      showToast('Failed to export project: ' + err.message, 'error');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      {toast.show && (
        <div className={`fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full shadow-lg text-sm font-semibold transition-all ${toast.type === 'error' ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'}`}>
          {toast.message}
        </div>
      )}
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
            onClick={toggleSplitView}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              isSplitView ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            {isSplitView ? 'Merge View' : 'Split View'}
          </button>
          <button
            onClick={() => setShowPreview(true)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-xs text-slate-300 font-medium transition-colors"
          >
            Preview
          </button>
          <button
            disabled={isSaving}
            onClick={handleSave}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 rounded text-xs text-slate-300 font-medium transition-colors flex items-center"
          >
            {isSaving ? <><Spinner /> Saving...</> : <span>Save</span>}
          </button>
          <button
            disabled={isExporting}
            onClick={handleExport}
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded text-xs font-semibold text-white shadow transition-all flex items-center space-x-1"
          >
            {isExporting ? <><Spinner /> Exporting...</> : <span>Export</span>}
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
