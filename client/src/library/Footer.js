export const FooterDef = {
  type: 'Footer',
  category: 'Navigation',
  label: 'Footer',
  icon: 'layout-footer',
  defaultProps: {
    copyrightText: '© 2026 CoDraw. All rights reserved.',
    backgroundColor: '#0f172a',
    textColor: '#94a3b8',
  },
  propsSchema: [
    { key: 'copyrightText', label: 'Copyright Text', type: 'text' },
    { key: 'backgroundColor', label: 'Background', type: 'color' },
    { key: 'textColor', label: 'Text Color', type: 'color' },
  ],
  styleMap: {
    tailwind: {
      wrapper: 'w-full py-6 px-6 text-center border-t border-slate-800 mt-auto',
      copyright: 'text-sm font-medium',
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

export default function Footer({ copyrightText, backgroundColor, textColor }) {
  return (
    <footer className="{{WRAPPER_CLASS}}" style={{ backgroundColor, color: textColor }}>
      <p className="{{COPYRIGHT_CLASS}}">{copyrightText}</p>
    </footer>
  );
}`,
    ts: `import React from 'react';
{{CSS_IMPORT}}

interface FooterProps {
  copyrightText: string;
  backgroundColor: string;
  textColor: string;
}

export default function Footer({ copyrightText, backgroundColor, textColor }: FooterProps) {
  return (
    <footer className="{{WRAPPER_CLASS}}" style={{ backgroundColor, color: textColor }}>
      <p className="{{COPYRIGHT_CLASS}}">{copyrightText}</p>
    </footer>
  );
}`,
  },
};
