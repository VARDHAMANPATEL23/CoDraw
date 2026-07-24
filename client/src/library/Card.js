export const CardDef = {
  type: 'Card',
  category: 'UI Blocks',
  label: 'Card',
  icon: 'card-block',
  defaultProps: {
    title: 'Card Title',
    description: 'This is a clean container card for displaying key info.',
    buttonText: 'Learn More',
    backgroundColor: '#1e293b',
    textColor: '#f8fafc',
  },
  propsSchema: [
    { key: 'title', label: 'Card Title', type: 'text' },
    { key: 'description', label: 'Description', type: 'text' },
    { key: 'buttonText', label: 'Button Text', type: 'text' },
    { key: 'backgroundColor', label: 'Background', type: 'color' },
    { key: 'textColor', label: 'Text Color', type: 'color' },
  ],
  styleMap: {
    tailwind: {
      wrapper: 'p-6 rounded-xl border border-slate-800 shadow-xl max-w-sm my-4',
      title: 'text-lg font-bold mb-2',
      desc: 'text-sm text-slate-400 mb-4 leading-relaxed',
      btn: 'px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow transition-all',
    },
    'css-modules': { wrapper: 'card__wrapper', title: 'card__title', desc: 'card__desc', btn: 'card__btn' },
    bootstrap: { wrapper: 'card p-3 my-3', title: 'card-title', desc: 'card-text', btn: 'btn btn-primary btn-sm' },
  },
  templates: {
    js: `import React from 'react';
{{CSS_IMPORT}}

export default function Card({ title, description, buttonText, backgroundColor, textColor }) {
  return (
    <div className="{{WRAPPER_CLASS}}" style={{ backgroundColor, color: textColor }}>
      <h3 className="{{TITLE_CLASS}}">{title}</h3>
      <p className="{{DESC_CLASS}}">{description}</p>
      {buttonText && <button className="{{BTN_CLASS}}">{buttonText}</button>}
    </div>
  );
}`,
    ts: `import React from 'react';
{{CSS_IMPORT}}

interface CardProps {
  title: string;
  description: string;
  buttonText?: string;
  backgroundColor?: string;
  textColor?: string;
}

export default function Card({ title, description, buttonText, backgroundColor, textColor }: CardProps) {
  return (
    <div className="{{WRAPPER_CLASS}}" style={{ backgroundColor, color: textColor }}>
      <h3 className="{{TITLE_CLASS}}">{title}</h3>
      <p className="{{DESC_CLASS}}">{description}</p>
      {buttonText && <button className="{{BTN_CLASS}}">{buttonText}</button>}
    </div>
  );
}`,
  },
};
