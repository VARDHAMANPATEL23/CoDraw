export const CTABlockDef = {
  type: 'CTABlock',
  category: 'UI Blocks',
  label: 'CTA Block',
  icon: 'megaphone',
  styleableElements: ['Wrapper', 'Heading', 'Subheading', 'Button'],
  defaultProps: {
    heading: 'Ready to build your next project?',
    subheading: 'Join thousands of creators using CoDraw to build visually.',
    buttonText: 'Start Building Now',
    backgroundColor: 'transparent',
    textColor: '#ffffff',
    linkTo: '',
    innerStyles: {},
  },
  propsSchema: [
    { key: 'heading', label: 'Heading', type: 'text' },
    { key: 'subheading', label: 'Subheading', type: 'text' },
    { key: 'buttonText', label: 'Button Text', type: 'text' },
    { key: 'backgroundColor', label: 'Background', type: 'color' },
    { key: 'textColor', label: 'Text Color', type: 'color' },
    { key: 'linkTo', label: 'Link URL (for MPA)', type: 'text' },
  ],
  styleMap: {
    tailwind: {
      wrapper: 'w-full py-16 px-8 rounded-3xl text-center shadow-2xl my-10 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 to-purple-900 border border-white/10 relative overflow-hidden',
      heading: 'text-4xl font-extrabold mb-4 tracking-tight drop-shadow-md',
      subheading: 'text-lg text-indigo-200 mb-8 max-w-xl leading-relaxed',
      btn: 'px-8 py-4 bg-white text-indigo-950 font-black rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 hover:bg-slate-50 transition-all cursor-pointer inline-block no-underline',
    },
    'css-modules': { wrapper: 'cta__wrapper', heading: 'cta__heading', subheading: 'cta__subheading', btn: 'cta__btn' },
    bootstrap: { wrapper: 'p-5 rounded text-center my-4', heading: 'h2', subheading: 'lead', btn: 'btn btn-light' },
  },
  templates: {
    js: `import React from 'react';
{{CSS_IMPORT}}

export default function CTABlock({ heading, subheading, buttonText, backgroundColor, textColor, linkTo, innerStyles = {} }) {
  const getInnerStyle = (elName) => innerStyles[elName] || {};
  return (
    <div className="{{WRAPPER_CLASS}}" style={{ backgroundColor, color: textColor, ...getInnerStyle('Wrapper') }}>
      <h2 className="{{HEADING_CLASS}}" style={getInnerStyle('Heading')}>{heading}</h2>
      <p className="{{SUBHEADING_CLASS}}" style={getInnerStyle('Subheading')}>{subheading}</p>
      {linkTo ? (
        <a href={linkTo} className="{{BTN_CLASS}}" style={getInnerStyle('Button')}>{buttonText}</a>
      ) : (
        <button className="{{BTN_CLASS}}" style={getInnerStyle('Button')}>{buttonText}</button>
      )}
    </div>
  );
}`,
    ts: `import React from 'react';
{{CSS_IMPORT}}

interface CTABlockProps {
  heading: string;
  subheading: string;
  buttonText: string;
  backgroundColor?: string;
  textColor?: string;
  linkTo?: string;
  innerStyles?: Record<string, React.CSSProperties>;
}

export default function CTABlock({ heading, subheading, buttonText, backgroundColor, textColor, linkTo, innerStyles = {} }: CTABlockProps) {
  const getInnerStyle = (elName: string) => innerStyles[elName] || {};
  return (
    <div className="{{WRAPPER_CLASS}}" style={{ backgroundColor, color: textColor, ...getInnerStyle('Wrapper') }}>
      <h2 className="{{HEADING_CLASS}}" style={getInnerStyle('Heading')}>{heading}</h2>
      <p className="{{SUBHEADING_CLASS}}" style={getInnerStyle('Subheading')}>{subheading}</p>
      {linkTo ? (
        <a href={linkTo} className="{{BTN_CLASS}}" style={getInnerStyle('Button')}>{buttonText}</a>
      ) : (
        <button className="{{BTN_CLASS}}" style={getInnerStyle('Button')}>{buttonText}</button>
      )}
    </div>
  );
}`,
  },
};
