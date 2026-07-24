import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { componentLibrary } from '../library';

function DraggableComponentItem({ item }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `library-${item.type}`,
    data: {
      type: item.type,
      defaultProps: item.defaultProps,
    },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`p-2.5 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-lg cursor-grab active:cursor-grabbing transition-all flex items-center justify-between text-xs text-slate-200 select-none ${
        isDragging ? 'opacity-40 ring-2 ring-indigo-500' : ''
      }`}
    >
      <div className="flex items-center space-x-2">
        <span className="text-indigo-400 font-bold">⋮⋮</span>
        <span className="font-medium">{item.label}</span>
      </div>
      <span className="text-[10px] text-slate-500 font-mono uppercase bg-slate-900 px-1.5 py-0.5 rounded">
        {item.category}
      </span>
    </div>
  );
}

export default function LeftPanel() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredComponents = componentLibrary.filter((comp) =>
    comp.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    comp.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    comp.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = ['Layout', 'Navigation', 'Typography', 'Forms & Input', 'Media', 'UI Blocks'];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col select-none overflow-hidden">
      <div className="p-4 border-b border-slate-800 space-y-3">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Components</h2>
        <input
          type="text"
          placeholder="Search components..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {searchQuery ? (
          <div className="space-y-2">
            <h3 className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
              Search Results ({filteredComponents.length})
            </h3>
            {filteredComponents.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-2">No matching components</p>
            ) : (
              filteredComponents.map((item) => (
                <DraggableComponentItem key={item.type} item={item} />
              ))
            )}
          </div>
        ) : (
          categories.map((category) => {
            const categoryComps = componentLibrary.filter((c) => c.category === category);
            if (categoryComps.length === 0) return null;
            return (
              <div key={category} className="space-y-2">
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  {category}
                </h3>
                <div className="space-y-2">
                  {categoryComps.map((item) => (
                    <DraggableComponentItem key={item.type} item={item} />
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}
