import React, { useEffect, useState } from 'react';
import { DndContext } from '@dnd-kit/core';
import { v4 as uuidv4 } from 'uuid';
import TopBar from './components/TopBar';
import LeftPanel from './components/LeftPanel';
import CanvasArea from './components/CanvasArea';
import RightPanel from './components/RightPanel';
import BottomBar from './components/BottomBar';
import ProjectDashboard from './components/ProjectDashboard';
import { useCanvasStore } from './store/useCanvasStore';
import { useOfflineSync } from './hooks/useOfflineSync';

function EditorView({ onBackToDashboard }) {
  useOfflineSync();
  const { addComponent, selectedId, undo, redo, removeComponent, duplicateComponent } = useCanvasStore();

  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
      const isInput = activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select';

      if (isInput) return;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          redo();
        } else {
          e.preventDefault();
          undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        if (selectedId) duplicateComponent(selectedId);
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedId) {
          e.preventDefault();
          removeComponent(selectedId);
        }
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

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="h-screen w-screen flex flex-col overflow-hidden bg-slate-950">
        <TopBar onBackToDashboard={onBackToDashboard} />
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

export default function App() {
  const [view, setView] = useState('dashboard');

  return view === 'dashboard' ? (
    <ProjectDashboard onOpenProject={() => setView('editor')} />
  ) : (
    <EditorView onBackToDashboard={() => setView('dashboard')} />
  );
}
