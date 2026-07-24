export const FeatureBlockDef = {
  type: 'FeatureBlock',
  category: 'UI Blocks',
  label: 'Feature Block',
  icon: 'sparkles',
  defaultProps: {
    title: 'Lightning Fast Export',
    description: 'Export clean, modular React CRA code in seconds with zero lock-in.',
    iconSymbol: '⚡',
  },
  propsSchema: [
    { key: 'title', label: 'Feature Title', type: 'text' },
    { key: 'description', label: 'Description', type: 'text' },
    { key: 'iconSymbol', label: 'Icon Symbol', type: 'text' },
  ],
  styleMap: {
    tailwind: {
      wrapper: 'flex items-start space-x-4 p-5 bg-slate-900 border border-slate-800 rounded-xl my-4',
      iconContainer: 'text-2xl p-3 bg-indigo-950 rounded-lg text-indigo-400',
      title: 'text-base font-bold text-slate-100 mb-1',
      desc: 'text-xs text-slate-400 leading-relaxed',
    },
    'css-modules': { wrapper: 'feat__wrapper', iconContainer: 'feat__icon', title: 'feat__title', desc: 'feat__desc' },
    bootstrap: { wrapper: 'd-flex align-items-start p-3 my-3 border rounded', iconContainer: 'me-3 fs-3', title: 'h5', desc: 'text-muted small' },
  },
  templates: {
    js: `import React from 'react';
{{CSS_IMPORT}}

export default function FeatureBlock({ title, description, iconSymbol = '⚡' }) {
  return (
    <div className="{{WRAPPER_CLASS}}">
      <div className="{{ICONCONTAINER_CLASS}}">{iconSymbol}</div>
      <div>
        <h4 className="{{TITLE_CLASS}}">{title}</h4>
        <p className="{{DESC_CLASS}}">{description}</p>
      </div>
    </div>
  );
}`,
    ts: `import React from 'react';
{{CSS_IMPORT}}

interface FeatureBlockProps {
  title: string;
  description: string;
  iconSymbol?: string;
}

export default function FeatureBlock({ title, description, iconSymbol = '⚡' }: FeatureBlockProps) {
  return (
    <div className="{{WRAPPER_CLASS}}">
      <div className="{{ICONCONTAINER_CLASS}}">{iconSymbol}</div>
      <div>
        <h4 className="{{TITLE_CLASS}}">{title}</h4>
        <p className="{{DESC_CLASS}}">{description}</p>
      </div>
    </div>
  );
}`,
  },
};
