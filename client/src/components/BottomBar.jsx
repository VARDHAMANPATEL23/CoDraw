import React, { useState } from 'react';
import { useCanvasStore } from '../store/useCanvasStore';

export default function BottomBar() {
  const { components, zoomLevel, zoomIn, zoomOut, resetZoom, showGrid, toggleGrid, meta } = useCanvasStore();
  const [showJsonModal, setShowJsonModal] = useState(false);

  const currentJSON = {
    meta,
    canvas: {
      width: 1440,
      gridSize: 8,
      components,
    },
  };

  return (
    <footer className="h-9 bg-slate-900 border-t border-slate-800 text-slate-400 px-4 flex items-center justify-between text-xs select-none z-20">
      <div className="flex items-center space-x-3">
        <span className="font-mono text-slate-500">Zoom:</span>
        <button
          onClick={zoomOut}
          className="w-5 h-5 flex items-center justify-center bg-slate-800 hover:bg-slate-700 rounded text-slate-200 font-bold"
          title="Zoom Out"
        >
          -
        </button>
        <span className="font-mono text-slate-200 w-10 text-center">{zoomLevel}%</span>
        <button
          onClick={zoomIn}
          className="w-5 h-5 flex items-center justify-center bg-slate-800 hover:bg-slate-700 rounded text-slate-200 font-bold"
          title="Zoom In"
        >
          +
        </button>
        <button
          onClick={resetZoom}
          className="text-[10px] bg-slate-800 hover:bg-slate-700 px-1.5 py-0.5 rounded text-slate-400 hover:text-slate-200"
          title="Reset Zoom to 85%"
        >
          Reset
        </button>

        <span className="text-slate-700">|</span>

        <button
          onClick={toggleGrid}
          className={`flex items-center space-x-1.5 text-xs px-2 py-0.5 rounded transition-colors ${
            showGrid ? 'bg-indigo-950/80 text-indigo-300 border border-indigo-800/60' : 'bg-slate-800 text-slate-400'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
          <span>Grid Overlay</span>
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <span>
          Components: <strong className="text-slate-200">{components.length}</strong>
        </span>
        <span className="text-slate-700">|</span>
        <button
          onClick={() => setShowJsonModal(true)}
          className="text-indigo-400 hover:text-indigo-300 font-mono font-medium hover:underline"
        >
          JSON View
        </button>
      </div>

      {showJsonModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-2xl p-6 text-slate-200 flex flex-col max-h-[80vh]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="font-bold text-indigo-400">Project Canvas JSON</h3>
              <button
                onClick={() => setShowJsonModal(false)}
                className="text-slate-400 hover:text-slate-200 font-bold text-sm"
              >
                ✕
              </button>
            </div>
            <pre className="flex-1 overflow-auto bg-slate-950 p-4 rounded-lg text-xs font-mono text-emerald-400 mt-4 border border-slate-800">
              {JSON.stringify(currentJSON, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </footer>
  );
}
