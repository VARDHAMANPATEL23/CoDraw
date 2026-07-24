import React from 'react';
import { useDraggable } from '@dnd-kit/core';

export default function DraggableLibraryItem({ item }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `library-${item.type}`,
    data: { type: item.type, defaultProps: item.defaultProps },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`p-2 text-xs bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 rounded cursor-grab active:cursor-grabbing flex items-center justify-between text-slate-200 select-none transition-all ${
        isDragging ? 'opacity-40 border-indigo-500' : ''
      }`}
    >
      <span className="font-medium">{item.label}</span>
      <span className="text-[10px] text-slate-400 font-mono">{item.category}</span>
    </div>
  );
}
