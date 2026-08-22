import React, { useState, useRef } from 'react';
import { useCanvasStore } from '../store/useCanvasStore';
import { getComponentDef } from '../library';
import { RenderComponentNode } from './CanvasArea';

export default function IsolatedCanvasArea() {
  const {
    isolatedComponentId,
    components,
    exitIsolation,
    isolatedZoomLevel,
    setIsolatedZoomLevel,
    setActiveCanvas
  } = useCanvasStore();
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const startPanRef = useRef({ x: 0, y: 0 });

  const containerRef = useRef(null);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onWheel = (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault(); // This actually stops the browser from zooming because { passive: false }
        const delta = e.deltaY < 0 ? 5 : -5;
        setIsolatedZoomLevel(prev => Math.min(Math.max(prev + delta, 25), 200));
      }
    };

    container.addEventListener('wheel', onWheel, { passive: false });
    return () => container.removeEventListener('wheel', onWheel);
  }, [setIsolatedZoomLevel]);

  const comp = components.find((c) => c.id === isolatedComponentId);

  if (!comp) {
    return (
      <div className="h-full w-full bg-slate-950 flex flex-col items-center justify-center text-slate-500 border-l border-slate-800">
        <p className="mb-4">No component selected for isolation.</p>
        <button onClick={exitIsolation} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded">
          Close Split View
        </button>
      </div>
    );
  }

  const def = getComponentDef(comp.type);

  const handleMouseDown = (e) => {
    if (e.button === 1) { // Middle mouse button
      e.preventDefault();
      setIsPanning(true);
      startPanRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    }
  };

  const handleMouseMove = (e) => {
    if (isPanning) {
      setPan({
        x: e.clientX - startPanRef.current.x,
        y: e.clientY - startPanRef.current.y
      });
    }
  };

  const handleMouseUp = (e) => {
    if (e.button === 1) {
      setIsPanning(false);
    }
  };

  return (
    <div 
      className="h-full w-full bg-slate-950 flex flex-col border-l border-slate-800 overflow-hidden relative select-none"
      onMouseEnter={() => setActiveCanvas('isolated')}
    >
      <div className="h-10 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 shrink-0 z-20">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Isolation: {def?.label || comp.type}
          </span>
          <span className="text-xs text-slate-500 ml-4">Middle-click to pan • Ctrl+Wheel to zoom ({isolatedZoomLevel}%)</span>
        </div>
        <button
          onClick={exitIsolation}
          className="text-xs font-semibold text-slate-400 hover:text-white px-2 py-1 rounded hover:bg-slate-800 transition-colors"
        >
          [X]
        </button>
      </div>

      <div
        ref={containerRef}
        className={`flex-1 relative overflow-hidden ${isPanning ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => setIsPanning(false)}
      >
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${isolatedZoomLevel / 100})`,
            transformOrigin: 'center center',
            transition: isPanning ? 'none' : 'transform 0.1s ease-out',
            backgroundImage: 'radial-gradient(circle, #334155 1px, transparent 1px)',
            backgroundSize: '8px 8px'
          }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          {/* This wrapper simulates the actual CanvasArea.jsx wrapper to ensure 1:1 CSS inheritance */}
          <div className="w-[1440px] min-h-[900px] shrink-0 rounded-lg bg-slate-900 shadow-2xl relative flex flex-col pointer-events-auto border border-slate-800 ring-2 ring-indigo-500/20 group">
            <RenderComponentNode
              comp={comp}
              index={0}
              totalComponents={1}
              disableInteractions={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
