export const IconComponentDef = {
  type: 'Icon',
  category: 'Media',
  label: 'Icon',
  icon: 'star',
  defaultProps: {
    iconName: '★',
    size: '24px',
    color: '#6366f1',
  },
  propsSchema: [
    { key: 'iconName', label: 'Icon Symbol', type: 'text' },
    { key: 'size', label: 'Size', type: 'text' },
    { key: 'color', label: 'Color', type: 'color' },
  ],
  styleMap: {
    tailwind: { wrapper: 'inline-flex items-center justify-center p-1' },
    'css-modules': { wrapper: 'icon__wrapper' },
    bootstrap: { wrapper: 'd-inline-block' },
  },
  templates: {
    js: `import React from 'react';
{{CSS_IMPORT}}

export default function Icon({ iconName = '★', size = '24px', color = '#6366f1' }) {
  return <span className="{{WRAPPER_CLASS}}" style={{ fontSize: size, color }}>{iconName}</span>;
}`,
    ts: `import React from 'react';
{{CSS_IMPORT}}

interface IconProps {
  iconName?: string;
  size?: string;
  color?: string;
}

export default function Icon({ iconName = '★', size = '24px', color = '#6366f1' }: IconProps) {
  return <span className="{{WRAPPER_CLASS}}" style={{ fontSize: size, color }}>{iconName}</span>;
}`,
  },
};
