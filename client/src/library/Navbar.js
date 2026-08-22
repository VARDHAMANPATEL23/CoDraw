export const NavbarDef = {
  type: 'Navbar',
  category: 'Navigation',
  label: 'Navbar',
  icon: 'layout-navbar',
  styleableElements: ['Wrapper', 'Brand', 'LinkList', 'Link'],
  defaultProps: {
    brand: 'CoDraw',
    links: ['Home', 'Features', 'Pricing', 'Contact'],
    backgroundColor: 'transparent',
    textColor: '#f8fafc',
    innerStyles: {},
  },
  propsSchema: [
    { key: 'brand', label: 'Brand Name', type: 'text' },
    { key: 'links', label: 'Nav Links', type: 'array-text' },
    { key: 'backgroundColor', label: 'Background', type: 'color' },
    { key: 'textColor', label: 'Text Color', type: 'color' },
  ],
  styleMap: {
    tailwind: {
      wrapper: 'flex items-center justify-between px-8 py-5 w-full bg-slate-900/80 backdrop-blur-md border-b border-white/5 relative z-10',
      brand: 'text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400',
      linkList: 'flex items-center gap-8 list-none m-0 p-0',
      link: 'text-sm font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer',
    },
    'css-modules': {
      wrapper: 'navbar__wrapper',
      brand: 'navbar__brand',
      linkList: 'navbar__linkList',
      link: 'navbar__link',
    },
    bootstrap: {
      wrapper: 'navbar navbar-expand-lg px-4 py-3 shadow-sm',
      brand: 'navbar-brand font-weight-bold text-primary',
      linkList: 'navbar-nav d-flex flex-row gap-4',
      link: 'nav-link',
    },
  },
  templates: {
    js: `import React from 'react';
{{CSS_IMPORT}}

export default function Navbar({ brand, links, backgroundColor, textColor, innerStyles = {} }) {
  const getInnerStyle = (elName) => innerStyles[elName] || {};
  return (
    <nav className="{{WRAPPER_CLASS}}" style={{ backgroundColor, color: textColor, ...getInnerStyle('Wrapper') }}>
      <span className="{{BRAND_CLASS}}" style={getInnerStyle('Brand')}>{brand}</span>
      <ul className="{{LINKLIST_CLASS}}" style={getInnerStyle('LinkList')}>
        {links.map((link, i) => (
          <li key={i}><a href="#" className="{{LINK_CLASS}}" style={{ color: textColor, ...getInnerStyle('Link') }}>{link}</a></li>
        ))}
      </ul>
    </nav>
  );
}`,
    ts: `import React from 'react';
{{CSS_IMPORT}}

interface NavbarProps {
  brand: string;
  links: string[];
  backgroundColor?: string;
  textColor?: string;
  innerStyles?: Record<string, React.CSSProperties>;
}

export default function Navbar({ brand, links, backgroundColor, textColor, innerStyles = {} }: NavbarProps) {
  const getInnerStyle = (elName: string) => innerStyles[elName] || {};
  return (
    <nav className="{{WRAPPER_CLASS}}" style={{ backgroundColor, color: textColor, ...getInnerStyle('Wrapper') }}>
      <span className="{{BRAND_CLASS}}" style={getInnerStyle('Brand')}>{brand}</span>
      <ul className="{{LINKLIST_CLASS}}" style={getInnerStyle('LinkList')}>
        {links.map((link, i) => (
          <li key={i}><a href="#" className="{{LINK_CLASS}}" style={{ color: textColor, ...getInnerStyle('Link') }}>{link}</a></li>
        ))}
      </ul>
    </nav>
  );
}`,
  },
};
