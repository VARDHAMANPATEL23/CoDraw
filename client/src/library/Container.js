export const ContainerDef = {
  type: 'Container',
  category: 'Layout',
  label: 'Container',
  icon: 'box-container',
  defaultProps: {
    maxWidth: '1200px',
    padding: '1rem',
  },
  propsSchema: [
    { key: 'maxWidth', label: 'Max Width', type: 'text' },
    { key: 'padding', label: 'Padding', type: 'text' },
  ],
  styleMap: {
    tailwind: { wrapper: 'mx-auto px-4 w-full max-w-6xl' },
    'css-modules': { wrapper: 'container__wrapper' },
    bootstrap: { wrapper: 'container' },
  },
  templates: {
    js: `import React from 'react';
{{CSS_IMPORT}}

export default function Container({ children, maxWidth, padding }) {
  return (
    <div className="{{WRAPPER_CLASS}}" style={{ maxWidth, padding }}>
      {children}
    </div>
  );
}`,
    ts: `import React from 'react';
{{CSS_IMPORT}}

interface ContainerProps {
  children?: React.ReactNode;
  maxWidth?: string;
  padding?: string;
}

export default function Container({ children, maxWidth, padding }: ContainerProps) {
  return (
    <div className="{{WRAPPER_CLASS}}" style={{ maxWidth, padding }}>
      {children}
    </div>
  );
}`,
  },
};
