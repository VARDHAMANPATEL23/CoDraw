export const CTABlockDef = {
  type: 'CTABlock',
  category: 'UI Blocks',
  label: 'CTA Block',
  icon: 'megaphone',
  defaultProps: {
    heading: 'Ready to build your next project?',
    subheading: 'Join thousands of creators using CoDraw to build visually.',
    buttonText: 'Start Building Now',
    backgroundColor: '#312e81',
    textColor: '#ffffff',
  },
  propsSchema: [
    { key: 'heading', label: 'Heading', type: 'text' },
    { key: 'subheading', label: 'Subheading', type: 'text' },
    { key: 'buttonText', label: 'Button Text', type: 'text' },
    { key: 'backgroundColor', label: 'Background', type: 'color' },
    { key: 'textColor', label: 'Text Color', type: 'color' },
  ],
  styleMap: {
    tailwind: {
      wrapper: 'w-full py-12 px-8 rounded-2xl text-center shadow-2xl my-6 flex flex-col items-center justify-center',
      heading: 'text-2xl font-extrabold mb-2',
      subheading: 'text-sm text-indigo-200 mb-6 max-w-lg',
      btn: 'px-6 py-3 bg-white text-indigo-900 font-bold rounded-xl shadow-lg hover:bg-slate-100 transition-all',
    },
    'css-modules': { wrapper: 'cta__wrapper', heading: 'cta__heading', subheading: 'cta__subheading', btn: 'cta__btn' },
    bootstrap: { wrapper: 'p-5 rounded text-center my-4', heading: 'h2', subheading: 'lead', btn: 'btn btn-light' },
  },
  templates: {
    js: `import React from 'react';
{{CSS_IMPORT}}

export default function CTABlock({ heading, subheading, buttonText, backgroundColor, textColor }) {
  return (
    <div className="{{WRAPPER_CLASS}}" style={{ backgroundColor, color: textColor }}>
      <h2 className="{{HEADING_CLASS}}">{heading}</h2>
      <p className="{{SUBHEADING_CLASS}}">{subheading}</p>
      <button className="{{BTN_CLASS}}">{buttonText}</button>
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
}

export default function CTABlock({ heading, subheading, buttonText, backgroundColor, textColor }: CTABlockProps) {
  return (
    <div className="{{WRAPPER_CLASS}}" style={{ backgroundColor, color: textColor }}>
      <h2 className="{{HEADING_CLASS}}">{heading}</h2>
      <p className="{{SUBHEADING_CLASS}}">{subheading}</p>
      <button className="{{BTN_CLASS}}">{buttonText}</button>
    </div>
  );
}`,
  },
};
