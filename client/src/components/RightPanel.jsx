import React, { useState, useEffect } from 'react';
import { useCanvasStore } from '../store/useCanvasStore';
import { getComponentDef } from '../library';

export default function RightPanel() {
  const { selectedId, isolatedComponentId, isSplitView, components, updateComponent, removeComponent, isolateComponent, meta, setProjectMeta } = useCanvasStore();

  const effectiveSelectedId = isSplitView && isolatedComponentId ? isolatedComponentId : selectedId;
  const selectedComponent = components.find((c) => c.id === effectiveSelectedId);
  const def = selectedComponent ? getComponentDef(selectedComponent.type) : null;

  const [targetElement, setTargetElement] = useState('Wrapper');
  const [activeTab, setActiveTab] = useState('layout');

  useEffect(() => {
    setTargetElement((prev) => {
      if (def && def.styleableElements && def.styleableElements.length > 0) {
        return def.styleableElements.includes(prev) ? prev : def.styleableElements[0];
      }
      return 'Wrapper';
    });
  }, [effectiveSelectedId, def]);

  const handleStyleChange = (property, value) => {
    if (!effectiveSelectedId) return;
    const currentProps = selectedComponent.props;
    const currentInnerStyles = currentProps.innerStyles || {};
    const currentElementStyles = currentInnerStyles[targetElement] || {};

    updateComponent(effectiveSelectedId, {
      innerStyles: {
        ...currentInnerStyles,
        [targetElement]: {
          ...currentElementStyles,
          [property]: value
        }
      }
    });
  };

  const getStyleValue = (property) => {
    if (!selectedComponent || !selectedComponent.props.innerStyles) return '';
    const elStyles = selectedComponent.props.innerStyles[targetElement];
    return elStyles ? (elStyles[property] || '') : '';
  };

  const handlePropChange = (key, value) => {
    if (effectiveSelectedId) {
      updateComponent(effectiveSelectedId, { [key]: value });
    }
  };

  const handleStyleSystemChange = (e) => {
    const newSystem = e.target.value;
    if (window.confirm('Switching styling system will re-map component class styles. Continue?')) {
      setProjectMeta({ stylingSystem: newSystem });
    }
  };

  return (
    <aside className="w-full h-full bg-slate-900 border-l border-slate-800 text-slate-300 flex flex-col select-none overflow-y-auto">
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
            <div className="flex space-x-2">
              <button
                onClick={() => isolateComponent(selectedComponent.id)}
                className="text-xs text-indigo-400 hover:text-indigo-300 bg-indigo-950/60 border border-indigo-900/60 px-2 py-1 rounded hover:bg-indigo-900/80 transition-colors"
                title="Open in Component Isolation Mode"
              >
                Isolate
              </button>
              <button
                onClick={() => removeComponent(selectedComponent.id)}
                className="text-xs text-rose-400 hover:text-rose-300 bg-rose-950/60 border border-rose-900/60 px-2 py-1 rounded hover:bg-rose-900/80 transition-colors"
              >
                Delete
              </button>
            </div>
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
            
            {def.styleableElements && def.styleableElements.length > 0 && (
              <div className="mb-5 p-3 bg-slate-950/50 rounded-lg border border-slate-800/80">
                <label className="block text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-2">Target Element</label>
                <select
                  value={targetElement}
                  onChange={(e) => setTargetElement(e.target.value)}
                  className="w-full bg-slate-900 border border-indigo-500/50 rounded px-3 py-2 text-xs text-indigo-100 font-semibold focus:outline-none focus:border-indigo-500 shadow-inner"
                >
                  {def.styleableElements.map((el) => (
                    <option key={el} value={el}>{el}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="border border-slate-800 rounded-lg bg-slate-900 overflow-hidden shadow-inner">
              
              {/* Layout & Spacing */}
              <div className="border-b border-slate-800">
                <button
                  onClick={() => setActiveTab(activeTab === 'layout' ? null : 'layout')}
                  className="w-full flex items-center justify-between px-4 py-3 bg-slate-800/50 hover:bg-slate-800 text-xs font-bold text-slate-300 hover:text-indigo-400 transition-colors uppercase tracking-wider"
                >
                  <span>Layout & Spacing</span>
                  <span className="text-[10px]">{activeTab === 'layout' ? '▼' : '▶'}</span>
                </button>
                {activeTab === 'layout' && (
                  <div className="p-4 space-y-4 bg-slate-900">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-medium text-slate-400">Width</label>
                        <input type="text" value={getStyleValue('width')} onChange={(e) => handleStyleChange('width', e.target.value)} placeholder="100%, 500px" className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-medium text-slate-400">Height</label>
                        <input type="text" value={getStyleValue('height')} onChange={(e) => handleStyleChange('height', e.target.value)} placeholder="auto, 300px" className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-medium text-slate-400">Margin</label>
                        <input type="text" value={getStyleValue('margin')} onChange={(e) => handleStyleChange('margin', e.target.value)} placeholder="10px 20px" className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-medium text-slate-400">Padding</label>
                        <input type="text" value={getStyleValue('padding')} onChange={(e) => handleStyleChange('padding', e.target.value)} placeholder="2rem" className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-medium text-slate-400">Position</label>
                        <select value={getStyleValue('position')} onChange={(e) => handleStyleChange('position', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500">
                          <option value="">Static</option><option value="relative">Relative</option><option value="absolute">Absolute</option><option value="fixed">Fixed</option><option value="sticky">Sticky</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-medium text-slate-400">Z-Index</label>
                        <input type="number" value={getStyleValue('zIndex')} onChange={(e) => handleStyleChange('zIndex', e.target.value ? Number(e.target.value) : '')} placeholder="10" className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Typography */}
              <div className="border-b border-slate-800">
                <button
                  onClick={() => setActiveTab(activeTab === 'typography' ? null : 'typography')}
                  className="w-full flex items-center justify-between px-4 py-3 bg-slate-800/50 hover:bg-slate-800 text-xs font-bold text-slate-300 hover:text-indigo-400 transition-colors uppercase tracking-wider"
                >
                  <span>Typography</span>
                  <span className="text-[10px]">{activeTab === 'typography' ? '▼' : '▶'}</span>
                </button>
                {activeTab === 'typography' && (
                  <div className="p-4 space-y-4 bg-slate-900">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-medium text-slate-400">Font Family</label>
                      <input type="text" value={getStyleValue('fontFamily')} onChange={(e) => handleStyleChange('fontFamily', e.target.value)} placeholder="Inter, sans-serif" className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-medium text-slate-400">Size</label>
                        <input type="text" value={getStyleValue('fontSize')} onChange={(e) => handleStyleChange('fontSize', e.target.value)} placeholder="16px, 2rem" className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-medium text-slate-400">Weight</label>
                        <select value={getStyleValue('fontWeight')} onChange={(e) => handleStyleChange('fontWeight', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500">
                          <option value="">Default</option><option value="400">Regular (400)</option><option value="600">SemiBold (600)</option><option value="700">Bold (700)</option><option value="800">ExtraBold (800)</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-medium text-slate-400">Color</label>
                        <input type="color" value={getStyleValue('color') || '#ffffff'} onChange={(e) => handleStyleChange('color', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded p-0.5 h-8 cursor-pointer" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-medium text-slate-400">Align</label>
                        <select value={getStyleValue('textAlign')} onChange={(e) => handleStyleChange('textAlign', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500">
                          <option value="">Default</option><option value="left">Left</option><option value="center">Center</option><option value="right">Right</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Backgrounds & Borders */}
              <div>
                <button
                  onClick={() => setActiveTab(activeTab === 'borders' ? null : 'borders')}
                  className="w-full flex items-center justify-between px-4 py-3 bg-slate-800/50 hover:bg-slate-800 text-xs font-bold text-slate-300 hover:text-indigo-400 transition-colors uppercase tracking-wider"
                >
                  <span>Background & Borders</span>
                  <span className="text-[10px]">{activeTab === 'borders' ? '▼' : '▶'}</span>
                </button>
                {activeTab === 'borders' && (
                  <div className="p-4 space-y-4 bg-slate-900 border-t border-slate-800">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-medium text-slate-400">Background Color</label>
                      <input type="color" value={getStyleValue('backgroundColor') || '#ffffff'} onChange={(e) => handleStyleChange('backgroundColor', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded p-0.5 h-8 cursor-pointer" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-medium text-slate-400">Border Radius</label>
                        <input type="text" value={getStyleValue('borderRadius')} onChange={(e) => handleStyleChange('borderRadius', e.target.value)} placeholder="8px" className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-medium text-slate-400">Border Width</label>
                        <input type="text" value={getStyleValue('borderWidth')} onChange={(e) => handleStyleChange('borderWidth', e.target.value)} placeholder="1px" className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-medium text-slate-400">Border Color</label>
                        <input type="color" value={getStyleValue('borderColor') || '#000000'} onChange={(e) => handleStyleChange('borderColor', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded p-0.5 h-8 cursor-pointer" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-medium text-slate-400">Box Shadow</label>
                        <input type="text" value={getStyleValue('boxShadow')} onChange={(e) => handleStyleChange('boxShadow', e.target.value)} placeholder="0 4px 6px rgba(0,0,0,0.1)" className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

