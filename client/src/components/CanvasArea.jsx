import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useCanvasStore } from '../store/useCanvasStore';
import { getComponentDef } from '../library';

function RenderComponentNode({ comp, index, totalComponents }) {
  const {
    selectedId,
    setSelectedId,
    reorderComponents,
    duplicateComponent,
    removeComponent,
  } = useCanvasStore();

  const def = getComponentDef(comp.type);
  const isSelected = selectedId === comp.id;

  if (!def) return null;

  const props = comp.props || def.defaultProps;

  const renderVisual = () => {
    switch (comp.type) {
      case 'Section':
        return (
          <section className="w-full my-4 rounded-lg border border-slate-800 p-6" style={{ backgroundColor: props.backgroundColor }}>
            <span className="text-[10px] text-slate-500 font-mono uppercase">Section Container</span>
          </section>
        );
      case 'Container':
        return (
          <div className="mx-auto px-4 w-full max-w-6xl my-2 border border-dashed border-slate-800 p-4 rounded" style={{ maxWidth: props.maxWidth }}>
            <span className="text-[10px] text-slate-500 font-mono">Container ({props.maxWidth})</span>
          </div>
        );
      case 'Divider':
        return <hr className="w-full my-4 border-t border-slate-700" style={{ borderColor: props.color }} />;
      case 'Spacer':
        return <div className="w-full bg-indigo-500/10 border border-indigo-500/20 my-2 rounded flex items-center justify-center text-[10px] text-indigo-400 font-mono" style={{ height: props.height || '32px' }}>Spacer ({props.height || '32px'})</div>;
      case 'Navbar':
        return (
          <nav className="flex items-center justify-between px-6 py-4 w-full shadow-md" style={{ backgroundColor: props.backgroundColor, color: props.textColor }}>
            <span className="text-xl font-bold tracking-tight">{props.brand}</span>
            <ul className="flex space-x-6 list-none m-0 p-0">
              {(props.links || []).map((link, i) => (
                <li key={i}><span className="text-sm font-medium hover:opacity-80" style={{ color: props.textColor }}>{link}</span></li>
              ))}
            </ul>
          </nav>
        );
      case 'Footer':
        return (
          <footer className="w-full py-6 px-6 text-center border-t border-slate-800" style={{ backgroundColor: props.backgroundColor, color: props.textColor }}>
            <p className="text-sm font-medium">{props.copyrightText}</p>
          </footer>
        );
      case 'Heading':
        const Tag = props.level || 'h2';
        return <Tag className="font-bold tracking-tight my-3 px-4" style={{ color: props.textColor }}>{props.text}</Tag>;
      case 'Paragraph':
        return (
          <div className="p-4">
            <p className="leading-relaxed" style={{ fontSize: props.fontSize, color: props.textColor }}>
              {props.content}
            </p>
          </div>
        );
      case 'Badge':
        return (
          <div className="p-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: props.backgroundColor, color: props.textColor }}>
              {props.text}
            </span>
          </div>
        );
      case 'Button':
        return (
          <div className="p-4 flex justify-center">
            <button className="px-5 py-2.5 rounded-md font-medium shadow-sm transition-all cursor-pointer" style={{ backgroundColor: props.backgroundColor, color: props.textColor }}>
              {props.text}
            </button>
          </div>
        );
      case 'TextInput':
        return (
          <div className="p-4">
            <label className="block text-xs font-medium text-slate-300 mb-1">{props.label}</label>
            <input type={props.type || 'text'} placeholder={props.placeholder} className="w-full max-w-sm px-3 py-2 bg-slate-900 border border-slate-700 rounded text-sm text-slate-100" readOnly />
          </div>
        );
      case 'Textarea':
        return (
          <div className="p-4">
            <label className="block text-xs font-medium text-slate-300 mb-1">{props.label}</label>
            <textarea rows={props.rows || 4} placeholder={props.placeholder} className="w-full max-w-sm px-3 py-2 bg-slate-900 border border-slate-700 rounded text-sm text-slate-100" readOnly />
          </div>
        );
      case 'NumberInput':
        return (
          <div className="p-4">
            <label className="block text-xs font-medium text-slate-300 mb-1">{props.label}</label>
            <input type="number" min={props.min} max={props.max} step={props.step} className="w-full max-w-xs px-3 py-2 bg-slate-900 border border-slate-700 rounded text-sm text-slate-100" readOnly />
          </div>
        );
      case 'SelectDropdown':
        return (
          <div className="p-4">
            <label className="block text-xs font-medium text-slate-300 mb-1">{props.label}</label>
            <select className="w-full max-w-sm px-3 py-2 bg-slate-900 border border-slate-700 rounded text-sm text-slate-100">
              {(props.options || []).map((opt, i) => (
                <option key={i}>{opt}</option>
              ))}
            </select>
          </div>
        );
      case 'SearchBox':
        return (
          <div className="p-4">
            <input type="search" placeholder={props.placeholder} className="w-full max-w-sm px-3 py-2 bg-slate-900 border border-slate-700 rounded text-sm text-slate-100" readOnly />
          </div>
        );
      case 'Checkbox':
        return (
          <div className="p-4 flex items-center space-x-2">
            <input type="checkbox" defaultChecked={props.checked} className="w-4 h-4 rounded bg-slate-900 border-slate-700" />
            <span className="text-sm text-slate-200">{props.label}</span>
          </div>
        );
      case 'Radio':
        return (
          <div className="p-4 flex items-center space-x-2">
            <input type="radio" className="w-4 h-4 rounded-full bg-slate-900 border-slate-700" />
            <span className="text-sm text-slate-200">{props.label}</span>
          </div>
        );
      case 'Image':
        return (
          <div className="p-4">
            <img src={props.src} alt={props.alt} className="object-cover rounded shadow" style={{ width: props.width, borderRadius: props.borderRadius }} />
          </div>
        );
      case 'Icon':
        return (
          <div className="p-4 flex items-center">
            <span style={{ fontSize: props.size, color: props.color }}>{props.iconName}</span>
          </div>
        );
      case 'Card':
        return (
          <div className="p-6 rounded-xl border border-slate-800 shadow-xl max-w-sm my-4" style={{ backgroundColor: props.backgroundColor, color: props.textColor }}>
            <h3 className="text-lg font-bold mb-2">{props.title}</h3>
            <p className="text-sm text-slate-400 mb-4">{props.description}</p>
            {props.buttonText && <button className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg">{props.buttonText}</button>}
          </div>
        );
      case 'HeroSection':
        return (
          <section className="flex flex-col items-center justify-center text-center py-16 px-6 w-full" style={{ backgroundColor: props.backgroundColor, color: props.textColor }}>
            <h1 className="text-4xl font-extrabold tracking-tight mb-4">{props.title}</h1>
            <p className="text-lg opacity-80 max-w-2xl mb-6">{props.subtitle}</p>
            <button className="bg-indigo-600 text-white font-semibold px-6 py-2.5 rounded-lg shadow">{props.ctaText}</button>
          </section>
        );
      case 'CTABlock':
        return (
          <div className="w-full py-12 px-8 rounded-2xl text-center shadow-2xl my-6 flex flex-col items-center justify-center" style={{ backgroundColor: props.backgroundColor, color: props.textColor }}>
            <h2 className="text-2xl font-extrabold mb-2">{props.heading}</h2>
            <p className="text-sm text-indigo-200 mb-6 max-w-lg">{props.subheading}</p>
            <button className="px-6 py-3 bg-white text-indigo-900 font-bold rounded-xl">{props.buttonText}</button>
          </div>
        );
      case 'FeatureBlock':
        return (
          <div className="flex items-start space-x-4 p-5 bg-slate-900 border border-slate-800 rounded-xl my-4">
            <div className="text-2xl p-3 bg-indigo-950 rounded-lg text-indigo-400">{props.iconSymbol || '⚡'}</div>
            <div>
              <h4 className="text-base font-bold text-slate-100 mb-1">{props.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{props.description}</p>
            </div>
          </div>
        );
      default:
        return <div className="p-4 text-xs text-slate-400">{comp.type}</div>;
    }
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        setSelectedId(comp.id);
      }}
      className={`group relative w-full cursor-pointer transition-all border ${
        isSelected ? 'ring-2 ring-indigo-500 border-indigo-500 z-10' : 'border-transparent hover:border-slate-700'
      }`}
    >
      {/* Component Hover Control Toolbar */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-md shadow-lg flex items-center space-x-1 p-1 z-20">
        <button
          disabled={index === 0}
          onClick={(e) => {
            e.stopPropagation();
            reorderComponents(index, index - 1);
          }}
          className="p-1 hover:bg-slate-800 rounded text-slate-300 disabled:opacity-30 disabled:hover:bg-transparent text-xs"
          title="Move Up"
        >
          ▲
        </button>
        <button
          disabled={index === totalComponents - 1}
          onClick={(e) => {
            e.stopPropagation();
            reorderComponents(index, index + 1);
          }}
          className="p-1 hover:bg-slate-800 rounded text-slate-300 disabled:opacity-30 disabled:hover:bg-transparent text-xs"
          title="Move Down"
        >
          ▼
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            duplicateComponent(comp.id);
          }}
          className="p-1 hover:bg-slate-800 rounded text-indigo-400 text-xs font-semibold px-1.5"
          title="Duplicate (Ctrl+D)"
        >
          DUP
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            removeComponent(comp.id);
          }}
          className="p-1 hover:bg-rose-900/50 rounded text-rose-400 text-xs font-semibold px-1.5"
          title="Delete (Delete)"
        >
          DEL
        </button>
      </div>

      {renderVisual()}
    </div>
  );
}

export default function CanvasArea() {
  const { components, setSelectedId, zoomLevel, setZoomLevel, showGrid } = useCanvasStore();
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas-drop-zone',
  });

  const handleWheel = (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 5 : -5;
      setZoomLevel(zoomLevel + delta);
    }
  };

  return (
    <main
      onClick={() => setSelectedId(null)}
      onWheel={handleWheel}
      className="flex-1 bg-slate-950 flex flex-col items-center justify-start p-6 overflow-auto relative select-none"
    >
      <div
        style={{
          transform: `scale(${zoomLevel / 100})`,
          transformOrigin: 'top center',
          transition: 'transform 0.1s ease-out',
        }}
        className="my-4"
      >
        <div
          ref={setNodeRef}
          className={`w-[1440px] min-h-[900px] bg-slate-900 border rounded-lg shadow-2xl relative flex flex-col ${
            isOver ? 'border-indigo-500 ring-2 ring-indigo-500/50' : 'border-slate-800'
          }`}
          style={{
            backgroundImage: showGrid
              ? 'radial-gradient(circle, #334155 1px, transparent 1px)'
              : 'none',
            backgroundSize: '8px 8px',
          }}
        >
          {components.length === 0 ? (
            <div className="min-h-[900px] w-full p-4 flex flex-col items-center justify-center border-2 border-dashed border-slate-800/80 rounded-md">
              <span className="text-slate-600 text-sm font-medium select-none">
                Drag a component here to get started
              </span>
            </div>
          ) : (
            <div className="w-full flex-1 flex flex-col">
              {components.map((comp, idx) => (
                <RenderComponentNode key={comp.id} comp={comp} index={idx} totalComponents={components.length} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
