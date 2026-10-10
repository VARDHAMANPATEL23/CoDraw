import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { DndContext } from '@dnd-kit/core';
import { v4 as uuidv4 } from 'uuid';
import TopBar from './components/TopBar';
import LeftPanel from './components/LeftPanel';
import CanvasArea from './components/CanvasArea';
import IsolatedCanvasArea from './components/IsolatedCanvasArea';
import RightPanel from './components/RightPanel';
import BottomBar from './components/BottomBar';
import ProjectDashboard from './components/ProjectDashboard';
import NewProjectModal from './components/NewProjectModal';
import { useCanvasStore } from './store/useCanvasStore';
import { useOfflineSync } from './hooks/useOfflineSync';
import { getProjectFromDB } from './db/projectDB';
import useAppStore from './store/useAppStore';
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels';

function EditorView() {
  useOfflineSync();
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { addComponent, selectedId, undo, redo, removeComponent, duplicateComponent, meta } = useCanvasStore();
  const [loading, setLoading] = useState(true);

  // Hydrate store from IndexedDB if refreshed on /project/:id
  useEffect(() => {
    const hydrate = async () => {
      if (projectId && meta.projectId !== projectId) {
        try {
          const project = await getProjectFromDB(projectId);
          if (project) {
            useCanvasStore.setState({
              meta: project.meta,
              components: project.canvas?.components || [],
              selectedId: null,
              past: [],
              future: [],
            });
          } else {
            navigate('/', { replace: true });
            return;
          }
        } catch (err) {
          console.error('Failed to load project:', err);
          navigate('/', { replace: true });
          return;
        }
      }
      setLoading(false);
    };
    hydrate();
  }, [projectId, meta.projectId, navigate]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
      const isInput = activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select';
      if (isInput) return;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) { e.preventDefault(); redo(); }
        else { e.preventDefault(); undo(); }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault(); redo();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        if (selectedId) duplicateComponent(selectedId);
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedId) { e.preventDefault(); removeComponent(selectedId); }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, undo, redo, removeComponent, duplicateComponent]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && over.id === 'canvas-drop-zone' && active.data.current) {
      const { type, defaultProps } = active.data.current;
      const newComponent = {
        id: `comp_${uuidv4().substring(0, 8)}`,
        type,
        parentId: null,
        props: { ...defaultProps },
        children: [],
      };
      addComponent(newComponent);
    }
  };

  const { isSplitView } = useCanvasStore();

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-950 text-slate-400">
        <svg className="animate-spin mb-4 h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="text-sm font-medium tracking-wide">Loading workspace...</span>
      </div>
    );
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="h-screen w-screen flex flex-col overflow-hidden bg-slate-950">
        <TopBar onBackToDashboard={() => navigate('/')} />

        <PanelGroup direction="horizontal" className="flex-1 overflow-hidden">
          <Panel defaultSize={256} minSize={200} maxSize={400}>
            <LeftPanel />
          </Panel>

          <PanelResizeHandle className="w-1 bg-slate-800 hover:bg-indigo-500 transition-colors cursor-col-resize" />

          <Panel minSize={300}>
            {isSplitView ? (
              <PanelGroup direction="horizontal">
                <Panel defaultSize={50} minSize={20}>
                  <CanvasArea />
                </Panel>
                <PanelResizeHandle className="w-1 bg-slate-700 hover:bg-indigo-500 transition-colors cursor-col-resize" />
                <Panel defaultSize={50} minSize={20}>
                  <IsolatedCanvasArea />
                </Panel>
              </PanelGroup>
            ) : (
              <CanvasArea />
            )}
          </Panel>

          <PanelResizeHandle className="w-1 bg-slate-800 hover:bg-indigo-500 transition-colors cursor-col-resize" />

          <Panel defaultSize={320} minSize={250} maxSize={500}>
            <RightPanel />
          </Panel>
        </PanelGroup>

        <BottomBar />
      </div>
    </DndContext>
  );
}

function DashboardView() {
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const navigate = useNavigate();

  const handleOpenProject = (project) => {
    useCanvasStore.setState({
      meta: project.meta,
      components: project.canvas?.components || [],
      selectedId: null,
      past: [],
      future: [],
    });
    navigate(`/project/${project.meta.projectId}`);
  };

  const handleProjectCreated = (newProject) => {
    handleOpenProject(newProject);
  };

  return (
    <>
      <ProjectDashboard
        onOpenProject={handleOpenProject}
        onNewProjectClick={() => setShowNewProjectModal(true)}
      />
      <NewProjectModal
        isOpen={showNewProjectModal}
        onClose={() => setShowNewProjectModal(false)}
        onProjectCreated={handleProjectCreated}
      />
    </>
  );
}

function UpdateBanner() {
  const { updateAvailable, serviceWorkerRegistration, clearUpdate } = useAppStore();

  if (!updateAvailable) return null;

  const handleUpdate = () => {
    if (serviceWorkerRegistration && serviceWorkerRegistration.waiting) {
      serviceWorkerRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
    clearUpdate();
    window.location.reload();
  };

  return (
    <div className="fixed bottom-4 right-4 bg-indigo-600 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-4 z-[9999] animate-in slide-in-from-bottom-5">
      <div className="text-sm font-medium">A new version of CoDraw is available.</div>
      <button
        onClick={handleUpdate}
        className="bg-white text-indigo-600 px-3 py-1.5 rounded text-xs font-bold hover:bg-slate-100 transition-colors"
      >
        Reload to Update
      </button>
      <button
        onClick={clearUpdate}
        className="text-indigo-200 hover:text-white px-2 text-xs"
      >
        Dismiss
      </button>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <UpdateBanner />
      <Routes>
        <Route path="/" element={<DashboardView />} />
        <Route path="/project/:projectId" element={<EditorView />} />
      </Routes>
    </BrowserRouter>
  );
}
