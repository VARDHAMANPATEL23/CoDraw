export const CardDef = {
  type: 'Card',
  category: 'UI Blocks',
  label: 'Card',
  icon: 'card-block',
  styleableElements: ['Wrapper', 'Title', 'Description', 'Button'],
  defaultProps: {
    title: 'Card Title',
    description: 'This is a clean container card for displaying key info.',
    buttonText: 'Learn More',
    backgroundColor: '#1e293b',
    textColor: '#f8fafc',
    linkTo: '',
    innerStyles: {},
  },
  propsSchema: [
    { key: 'title', label: 'Card Title', type: 'text' },
    { key: 'description', label: 'Description', type: 'text' },
    { key: 'buttonText', label: 'Button Text', type: 'text' },
    { key: 'backgroundColor', label: 'Background', type: 'color' },
    { key: 'textColor', label: 'Text Color', type: 'color' },
    { key: 'linkTo', label: 'Link URL (for MPA)', type: 'text' },
  ],
  styleMap: {
    tailwind: {
      wrapper: 'p-6 rounded-xl border border-slate-800 shadow-xl max-w-sm my-4',
      title: 'text-lg font-bold mb-2',
      desc: 'text-sm text-slate-400 mb-4 leading-relaxed',
      btn: 'px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow transition-all inline-block no-underline',
    },
    'css-modules': { wrapper: 'card__wrapper', title: 'card__title', desc: 'card__desc', btn: 'card__btn' },
    bootstrap: { wrapper: 'card p-3 my-3', title: 'card-title', desc: 'card-text', btn: 'btn btn-primary btn-sm' },
  },
  templates: {
    js: `import React from 'react';
{{CSS_IMPORT}}

export default function Card({ title, description, buttonText, backgroundColor, textColor, linkTo, innerStyles = {} }) {
  const getInnerStyle = (elName) => innerStyles[elName] || {};
  return (
    <div className="{{WRAPPER_CLASS}}" style={{ backgroundColor, color: textColor, ...getInnerStyle('Wrapper') }}>
      <h3 className="{{TITLE_CLASS}}" style={getInnerStyle('Title')}>{title}</h3>
      <p className="{{DESC_CLASS}}" style={getInnerStyle('Description')}>{description}</p>
      {buttonText && linkTo ? (
        <a href={linkTo} className="{{BTN_CLASS}}" style={getInnerStyle('Button')}>{buttonText}</a>
      ) : buttonText ? (
        <button className="{{BTN_CLASS}}" style={getInnerStyle('Button')}>{buttonText}</button>
      ) : null}
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
  linkTo?: string;
  innerStyles?: Record<string, React.CSSProperties>;
}

export default function Card({ title, description, buttonText, backgroundColor, textColor, linkTo, innerStyles = {} }: CardProps) {
  const getInnerStyle = (elName: string) => innerStyles[elName] || {};
  return (
    <div className="{{WRAPPER_CLASS}}" style={{ backgroundColor, color: textColor, ...getInnerStyle('Wrapper') }}>
      <h3 className="{{TITLE_CLASS}}" style={getInnerStyle('Title')}>{title}</h3>
      <p className="{{DESC_CLASS}}" style={getInnerStyle('Description')}>{description}</p>
      {buttonText && linkTo ? (
        <a href={linkTo} className="{{BTN_CLASS}}" style={getInnerStyle('Button')}>{buttonText}</a>
      ) : buttonText ? (
        <button className="{{BTN_CLASS}}" style={getInnerStyle('Button')}>{buttonText}</button>
      ) : null}
    </div>
  );
}`,
  },
};
