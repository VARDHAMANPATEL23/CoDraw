export const NavbarDef = {
  type: 'Navbar',
  category: 'Navigation',
  label: 'Navbar',
  icon: 'layout-navbar',
  defaultProps: {
    brand: 'CoDraw',
    links: ['Home', 'Features', 'Pricing', 'Contact'],
    backgroundColor: '#0f172a',
    textColor: '#f8fafc',
  },
  propsSchema: [
    { key: 'brand', label: 'Brand Name', type: 'text' },
    { key: 'links', label: 'Nav Links', type: 'array-text' },
    { key: 'backgroundColor', label: 'Background', type: 'color' },
    { key: 'textColor', label: 'Text Color', type: 'color' },
  ],
  styleMap: {
    tailwind: {
      wrapper: 'flex items-center justify-between px-6 py-4 w-full shadow-md',
      brand: 'text-xl font-bold tracking-tight',
      link: 'text-sm font-medium hover:opacity-80 transition-opacity',
    },
    'css-modules': {
      wrapper: 'navbar__wrapper',
      brand: 'navbar__brand',
      link: 'navbar__link',
    },
    bootstrap: {
      wrapper: 'navbar navbar-expand-lg px-4 py-3',
      brand: 'navbar-brand font-weight-bold',
      link: 'nav-link',
    },
  },
  templates: {
    js: `import React from 'react';
{{CSS_IMPORT}}

export default function Navbar({ brand, links, backgroundColor, textColor }) {
  return (
    <nav className="{{WRAPPER_CLASS}}" style={{ backgroundColor, color: textColor }}>
      <span className="{{BRAND_CLASS}}">{brand}</span>
      <ul style={{ display: 'flex', gap: '1.5rem', listStyle: 'none', margin: 0, padding: 0 }}>
        {links.map((link, i) => (
          <li key={i}><a href="#" className="{{LINK_CLASS}}" style={{ color: textColor }}>{link}</a></li>
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
  backgroundColor: string;
  textColor: string;
}

export default function Navbar({ brand, links, backgroundColor, textColor }: NavbarProps) {
  return (
    <nav className="{{WRAPPER_CLASS}}" style={{ backgroundColor, color: textColor }}>
      <span className="{{BRAND_CLASS}}">{brand}</span>
      <ul style={{ display: 'flex', gap: '1.5rem', listStyle: 'none', margin: 0, padding: 0 }}>
        {links.map((link, i) => (
          <li key={i}><a href="#" className="{{LINK_CLASS}}" style={{ color: textColor }}>{link}</a></li>
        ))}
      </ul>
    </nav>
  );
}`,
  },
};
