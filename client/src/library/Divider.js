export const DividerDef = {
  type: 'Divider',
  category: 'Layout',
  label: 'Divider',
  icon: 'minus-line',
  defaultProps: {
    color: '#334155',
    margin: '1.5rem 0',
  },
  propsSchema: [
    { key: 'color', label: 'Color', type: 'color' },
    { key: 'margin', label: 'Margin', type: 'text' },
  ],
  styleMap: {
    tailwind: { wrapper: 'w-full border-t border-slate-700 my-6' },
    'css-modules': { wrapper: 'divider__wrapper' },
    bootstrap: { wrapper: 'dropdown-divider my-4' },
  },
  templates: {
    js: `import React from 'react';
{{CSS_IMPORT}}

export default function Divider({ color, margin }) {
  return <hr className="{{WRAPPER_CLASS}}" style={{ borderColor: color, margin }} />;
}`,
    ts: `import React from 'react';
{{CSS_IMPORT}}

interface DividerProps {
  color?: string;
  margin?: string;
}

export default function Divider({ color, margin }: DividerProps) {
  return <hr className="{{WRAPPER_CLASS}}" style={{ borderColor: color, margin }} />;
}`,
  },
};
