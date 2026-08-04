import React from 'react';
import { useCanvasStore } from '../store/useCanvasStore';
import { getComponentDef } from '../library';

export default function RightPanel() {
  const { selectedId, components, updateComponent, removeComponent, meta, setProjectMeta } = useCanvasStore();

  const selectedComponent = components.find((c) => c.id === selectedId);
  const def = selectedComponent ? getComponentDef(selectedComponent.type) : null;

  const handlePropChange = (key, value) => {
    if (selectedId) {
      updateComponent(selectedId, { [key]: value });
    }
  };

  const handleStyleSystemChange = (e) => {
    const newSystem = e.target.value;
    if (window.confirm('Switching styling system will re-map component class styles. Continue?')) {
      setProjectMeta({ stylingSystem: newSystem });
    }
  };

  return (
    <aside className="w-80 bg-slate-900 border-l border-slate-800 text-slate-300 flex flex-col select-none overflow-y-auto">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Properties</h2>
        <div className="flex items-center space-x-2">
          <select
            value={meta.stylingSystem || 'tailwind'}
            onChange={handleStyleSystemChange}
            className="text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-800 rounded px-2 py-0.5 font-semibold uppercase cursor-pointer"
            title="Switch Styling System"
          >
            <option value="tailwind">Tailwind</option>
            <option value="css-modules">CSS Modules</option>
            <option value="bootstrap">Bootstrap 5</option>
          </select>
          <span className="text-[10px] bg-slate-800 text-slate-400 border border-slate-700 rounded px-2 py-0.5 font-mono uppercase">
            {meta.language || 'JS'}
          </span>
        </div>
      </div>

      {!selectedComponent || !def ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <span className="text-slate-600 text-xs">Select a component on the canvas to edit its properties</span>
        </div>
      ) : (
        <div className="p-4 space-y-5 flex-1">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-100">{def.label}</h3>
              <span className="text-[10px] text-slate-500 font-mono">ID: {selectedComponent.id}</span>
            </div>
            <button
              onClick={() => removeComponent(selectedComponent.id)}
              className="text-xs text-rose-400 hover:text-rose-300 bg-rose-950/60 border border-rose-900/60 px-2 py-1 rounded hover:bg-rose-900/80 transition-colors"
            >
              Delete
            </button>
          </div>

          <div className="space-y-4">
            {(def.propsSchema || []).map((schema) => {
              const currentValue =
                selectedComponent.props[schema.key] !== undefined
                  ? selectedComponent.props[schema.key]
                  : def.defaultProps[schema.key];

              return (
                <div key={schema.key} className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-300">
                    {schema.label}
                  </label>

                  {schema.type === 'text' && (
                    <input
                      type="text"
                      value={currentValue || ''}
                      onChange={(e) => handlePropChange(schema.key, e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  )}

                  {schema.type === 'number' && (
                    <input
                      type="number"
                      value={currentValue !== undefined ? currentValue : 0}
                      onChange={(e) => handlePropChange(schema.key, Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  )}

                  {schema.type === 'color' && (
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={currentValue || '#000000'}
                        onChange={(e) => handlePropChange(schema.key, e.target.value)}
                        className="w-8 h-8 rounded border border-slate-700 bg-slate-800 cursor-pointer p-0.5"
                      />
                      <input
                        type="text"
                        value={currentValue || '#000000'}
                        onChange={(e) => handlePropChange(schema.key, e.target.value)}
                        className="flex-1 bg-slate-800 border border-slate-700 rounded px-3 py-1.5 text-xs text-slate-100 font-mono uppercase focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  )}

                  {schema.type === 'select' && (
                    <select
                      value={currentValue}
                      onChange={(e) => handlePropChange(schema.key, e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                    >
                      {(schema.options || []).map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  )}

                  {schema.type === 'boolean' && (
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(currentValue)}
                        onChange={(e) => handlePropChange(schema.key, e.target.checked)}
                        className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-xs text-slate-300">Enabled</span>
                    </label>
                  )}

                  {schema.type === 'array-text' && (
                    <input
                      type="text"
                      value={Array.isArray(currentValue) ? currentValue.join(', ') : currentValue || ''}
                      onChange={(e) =>
                        handlePropChange(
                          schema.key,
                          e.target.value.split(',').map((s) => s.trim())
                        )
                      }
                      placeholder="Comma-separated values"
                      className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-8 pt-4 border-t border-slate-800">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Advanced Styling</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-medium text-slate-400">Width</label>
                  <input
                    type="text"
                    value={selectedComponent.props.advancedWidth || ''}
                    onChange={(e) => handlePropChange('advancedWidth', e.target.value)}
                    placeholder="e.g. 100%, 500px"
                    className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-medium text-slate-400">Height</label>
                  <input
                    type="text"
                    value={selectedComponent.props.advancedHeight || ''}
                    onChange={(e) => handlePropChange('advancedHeight', e.target.value)}
                    placeholder="e.g. auto, 300px"
                    className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-medium text-slate-400">Margin</label>
                  <input
                    type="text"
                    value={selectedComponent.props.advancedMargin || ''}
                    onChange={(e) => handlePropChange('advancedMargin', e.target.value)}
                    placeholder="e.g. 10px 20px"
                    className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-medium text-slate-400">Padding</label>
                  <input
                    type="text"
                    value={selectedComponent.props.advancedPadding || ''}
                    onChange={(e) => handlePropChange('advancedPadding', e.target.value)}
                    placeholder="e.g. 2rem"
                    className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-medium text-slate-400">Border Radius (Corner Type)</label>
                <input
                  type="text"
                  value={selectedComponent.props.advancedBorderRadius || ''}
                  onChange={(e) => handlePropChange('advancedBorderRadius', e.target.value)}
                  placeholder="e.g. 8px, 50%"
                  className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-medium text-slate-400">Position</label>
                <select
                  value={selectedComponent.props.advancedPosition || ''}
                  onChange={(e) => handlePropChange('advancedPosition', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  <option value="">Default (Static)</option>
                  <option value="relative">Relative</option>
                  <option value="absolute">Absolute</option>
                  <option value="fixed">Fixed</option>
                  <option value="sticky">Sticky</option>
                </select>
              </div>

              {selectedComponent.props.advancedPosition && selectedComponent.props.advancedPosition !== 'static' && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-medium text-slate-400">Top / Bottom</label>
                    <input
                      type="text"
                      value={selectedComponent.props.advancedTopBottom || ''}
                      onChange={(e) => handlePropChange('advancedTopBottom', e.target.value)}
                      placeholder="e.g. top: 10px"
                      className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-medium text-slate-400">Left / Right</label>
                    <input
                      type="text"
                      value={selectedComponent.props.advancedLeftRight || ''}
                      onChange={(e) => handlePropChange('advancedLeftRight', e.target.value)}
                      placeholder="e.g. left: 5%"
                      className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-[10px] font-medium text-slate-400">Z-Index</label>
                <input
                  type="number"
                  value={selectedComponent.props.advancedZIndex || ''}
                  onChange={(e) => handlePropChange('advancedZIndex', e.target.value ? Number(e.target.value) : '')}
                  placeholder="e.g. 10"
                  className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
