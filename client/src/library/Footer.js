export const FooterDef = {
  type: 'Footer',
  category: 'Navigation',
  label: 'Footer',
  icon: 'layout-footer',
  styleableElements: ['Wrapper', 'Copyright'],
  defaultProps: {
    copyrightText: '© 2026 CoDraw. All rights reserved.',
    backgroundColor: '#020617',
    textColor: '#94a3b8',
    innerStyles: {},
  },
  propsSchema: [
    { key: 'copyrightText', label: 'Copyright Text', type: 'text' },
    { key: 'backgroundColor', label: 'Background', type: 'color' },
    { key: 'textColor', label: 'Text Color', type: 'color' },
  ],
  styleMap: {
    tailwind: {
      wrapper: 'w-full py-12 px-6 text-center border-t border-slate-800/50 mt-auto bg-slate-950 backdrop-blur-md',
      copyright: 'text-sm font-medium tracking-wide opacity-80',
    },
    'css-modules': {
      wrapper: 'footer__wrapper',
      copyright: 'footer__copyright',
    },
    bootstrap: {
      wrapper: 'footer py-4 text-center border-top',
      copyright: 'text-muted small',
    },
  },
  templates: {
    js: `import React from 'react';
{{CSS_IMPORT}}

export default function Footer({ copyrightText, backgroundColor, textColor, innerStyles = {} }) {
  const getInnerStyle = (elName) => innerStyles[elName] || {};
  return (
    <footer className="{{WRAPPER_CLASS}}" style={{ backgroundColor, color: textColor, ...getInnerStyle('Wrapper') }}>
      <p className="{{COPYRIGHT_CLASS}}" style={getInnerStyle('Copyright')}>{copyrightText}</p>
    </footer>
  );
}`,
    ts: `import React from 'react';
{{CSS_IMPORT}}

interface FooterProps {
  copyrightText: string;
  backgroundColor?: string;
  textColor?: string;
  innerStyles?: Record<string, React.CSSProperties>;
}

export default function Footer({ copyrightText, backgroundColor, textColor, innerStyles = {} }: FooterProps) {
  const getInnerStyle = (elName: string) => innerStyles[elName] || {};
  return (
    <footer className="{{WRAPPER_CLASS}}" style={{ backgroundColor, color: textColor, ...getInnerStyle('Wrapper') }}>
      <p className="{{COPYRIGHT_CLASS}}" style={getInnerStyle('Copyright')}>{copyrightText}</p>
    </footer>
  );
}`,
  },
};
