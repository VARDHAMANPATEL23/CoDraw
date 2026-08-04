import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { DndContext } from '@dnd-kit/core';
import { v4 as uuidv4 } from 'uuid';
import TopBar from './components/TopBar';
import LeftPanel from './components/LeftPanel';
import CanvasArea from './components/CanvasArea';
import RightPanel from './components/RightPanel';
import BottomBar from './components/BottomBar';
import ProjectDashboard from './components/ProjectDashboard';
import NewProjectModal from './components/NewProjectModal';
import { useCanvasStore } from './store/useCanvasStore';
import { useOfflineSync } from './hooks/useOfflineSync';
import { getProjectFromDB } from './db/projectDB';

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
  }, [projectId]);

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

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-950 text-slate-400 text-sm">
        Loading project...
      </div>
    );
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="h-screen w-screen flex flex-col overflow-hidden bg-slate-950">
        <TopBar onBackToDashboard={() => navigate('/')} />
        <div className="flex-1 flex overflow-hidden">
          <LeftPanel />
          <CanvasArea />
          <RightPanel />
        </div>
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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardView />} />
        <Route path="/project/:projectId" element={<EditorView />} />
      </Routes>
    </BrowserRouter>
  );
}
