import React from 'react';
import { useCanvasStore } from '../store/useCanvasStore';
import { getComponentDef } from '../library';

function RenderPreviewNode({ comp }) {
  const def = getComponentDef(comp.type);
  if (!def) return null;
  const props = comp.props || def.defaultProps;

  switch (comp.type) {
    case 'Section':
      return (
        <section className="w-full py-12 px-6 my-2" style={{ backgroundColor: props.backgroundColor }} />
      );
    case 'Container':
      return (
        <div className="mx-auto px-4 w-full max-w-6xl" style={{ maxWidth: props.maxWidth, padding: props.padding }} />
      );
    case 'Divider':
      return <hr className="w-full my-4 border-t border-slate-700" style={{ borderColor: props.color }} />;
    case 'Spacer':
      return <div className="w-full" style={{ height: props.height || '32px' }} />;
    case 'Navbar':
      return (
        <nav className="flex items-center justify-between px-6 py-4 w-full shadow-md" style={{ backgroundColor: props.backgroundColor, color: props.textColor }}>
          <span className="text-xl font-bold tracking-tight">{props.brand}</span>
          <ul className="flex space-x-6 list-none m-0 p-0">
            {(props.links || []).map((link, i) => (
              <li key={i}><a href="#preview" className="text-sm font-medium hover:opacity-80" style={{ color: props.textColor }}>{link}</a></li>
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
      return <Tag className="font-bold tracking-tight my-4 px-6" style={{ color: props.textColor }}>{props.text}</Tag>;
    case 'Paragraph':
      return (
        <div className="px-6 py-2">
          <p className="leading-relaxed" style={{ fontSize: props.fontSize, color: props.textColor }}>
            {props.content}
          </p>
        </div>
      );
    case 'Badge':
      return (
        <div className="px-6 py-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: props.backgroundColor, color: props.textColor }}>
            {props.text}
          </span>
        </div>
      );
    case 'Button':
      return (
        <div className="px-6 py-4 flex justify-center">
          <button className="px-6 py-2.5 rounded-lg font-semibold shadow-md transition-all cursor-pointer" style={{ backgroundColor: props.backgroundColor, color: props.textColor }}>
            {props.text}
          </button>
        </div>
      );
    case 'TextInput':
      return (
        <div className="px-6 py-3">
          <label className="block text-xs font-medium text-slate-300 mb-1">{props.label}</label>
          <input type={props.type || 'text'} placeholder={props.placeholder} className="w-full max-w-sm px-3 py-2 bg-slate-900 border border-slate-700 rounded text-sm text-slate-100" />
        </div>
      );
    case 'Textarea':
      return (
        <div className="px-6 py-3">
          <label className="block text-xs font-medium text-slate-300 mb-1">{props.label}</label>
          <textarea rows={props.rows || 4} placeholder={props.placeholder} className="w-full max-w-sm px-3 py-2 bg-slate-900 border border-slate-700 rounded text-sm text-slate-100" />
        </div>
      );
    case 'NumberInput':
      return (
        <div className="px-6 py-3">
          <label className="block text-xs font-medium text-slate-300 mb-1">{props.label}</label>
          <input type="number" min={props.min} max={props.max} step={props.step} className="w-full max-w-xs px-3 py-2 bg-slate-900 border border-slate-700 rounded text-sm text-slate-100" />
        </div>
      );
    case 'SelectDropdown':
      return (
        <div className="px-6 py-3">
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
        <div className="px-6 py-3">
          <input type="search" placeholder={props.placeholder} className="w-full max-w-sm px-3 py-2 bg-slate-900 border border-slate-700 rounded text-sm text-slate-100" />
        </div>
      );
    case 'Checkbox':
      return (
        <div className="px-6 py-3 flex items-center space-x-2">
          <input type="checkbox" defaultChecked={props.checked} className="w-4 h-4 rounded bg-slate-900 border-slate-700" />
          <span className="text-sm text-slate-200">{props.label}</span>
        </div>
      );
    case 'Radio':
      return (
        <div className="px-6 py-3 flex items-center space-x-2">
          <input type="radio" className="w-4 h-4 rounded-full bg-slate-900 border-slate-700" />
          <span className="text-sm text-slate-200">{props.label}</span>
        </div>
      );
    case 'Image':
      return (
        <div className="px-6 py-4">
          <img src={props.src} alt={props.alt} className="object-cover rounded shadow-lg" style={{ width: props.width, borderRadius: props.borderRadius }} />
        </div>
      );
    case 'Icon':
      return (
        <div className="px-6 py-3 flex items-center">
          <span style={{ fontSize: props.size, color: props.color }}>{props.iconName}</span>
        </div>
      );
    case 'Card':
      return (
        <div className="mx-6 my-4 p-6 rounded-xl border border-slate-800 shadow-xl max-w-sm" style={{ backgroundColor: props.backgroundColor, color: props.textColor }}>
          <h3 className="text-lg font-bold mb-2">{props.title}</h3>
          <p className="text-sm text-slate-400 mb-4">{props.description}</p>
          {props.buttonText && <button className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg">{props.buttonText}</button>}
        </div>
      );
    case 'HeroSection':
      return (
        <section className="flex flex-col items-center justify-center text-center py-20 px-6 w-full" style={{ backgroundColor: props.backgroundColor, color: props.textColor }}>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">{props.title}</h1>
          <p className="text-lg opacity-80 max-w-2xl mb-8">{props.subtitle}</p>
          <button className="bg-indigo-600 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:bg-indigo-500 transition-all">{props.ctaText}</button>
        </section>
      );
    case 'CTABlock':
      return (
        <div className="w-full py-16 px-8 rounded-2xl text-center shadow-2xl my-8 flex flex-col items-center justify-center" style={{ backgroundColor: props.backgroundColor, color: props.textColor }}>
          <h2 className="text-3xl font-extrabold mb-3">{props.heading}</h2>
          <p className="text-base text-indigo-200 mb-8 max-w-lg">{props.subheading}</p>
          <button className="px-8 py-3.5 bg-white text-indigo-900 font-bold rounded-xl shadow-xl">{props.buttonText}</button>
        </div>
      );
    case 'FeatureBlock':
      return (
        <div className="mx-6 my-4 flex items-start space-x-4 p-6 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-3xl p-3 bg-indigo-950 rounded-lg text-indigo-400">{props.iconSymbol || '⚡'}</div>
          <div>
            <h4 className="text-lg font-bold text-slate-100 mb-1">{props.title}</h4>
            <p className="text-sm text-slate-400 leading-relaxed">{props.description}</p>
          </div>
        </div>
      );
    default:
      return null;
  }
}

export default function LivePreviewModal({ onClose }) {
  const { components, meta } = useCanvasStore();

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col">
      {/* Header toolbar */}
      <div className="h-12 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between z-10">
        <div className="flex items-center space-x-3">
          <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
          <h2 className="font-bold text-slate-100 text-sm">Live Preview: <span className="text-indigo-400">{meta.name}</span></h2>
          <span className="text-[10px] font-mono bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-slate-400 uppercase">{meta.stylingSystem}</span>
        </div>
        <button
          onClick={onClose}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-1.5 rounded-lg shadow transition-all"
        >
          Exit Preview
        </button>
      </div>

      {/* Preview container */}
      <div className="flex-1 overflow-auto bg-slate-950 flex flex-col items-center">
        <div className="w-full max-w-[1440px] min-h-screen bg-slate-900 shadow-2xl flex flex-col">
          {components.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-500 font-medium">
              No components on canvas to preview
            </div>
          ) : (
            components.map((comp) => <RenderPreviewNode key={comp.id} comp={comp} />)
          )}
        </div>
      </div>
    </div>
  );
}
