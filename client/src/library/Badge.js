export const BadgeDef = {
  type: 'Badge',
  category: 'Typography',
  label: 'Badge',
  icon: 'tag-badge',
  defaultProps: {
    text: 'New Feature',
    backgroundColor: '#3b82f6',
    textColor: '#ffffff',
  },
  propsSchema: [
    { key: 'text', label: 'Badge Text', type: 'text' },
    { key: 'backgroundColor', label: 'Background Color', type: 'color' },
    { key: 'textColor', label: 'Text Color', type: 'color' },
  ],
  styleMap: {
    tailwind: { wrapper: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold' },
    'css-modules': { wrapper: 'badge__wrapper' },
    bootstrap: { wrapper: 'badge bg-primary' },
  },
  templates: {
    js: `import React from 'react';
{{CSS_IMPORT}}

export default function Badge({ text, backgroundColor, textColor }) {
  return <span className="{{WRAPPER_CLASS}}" style={{ backgroundColor, color: textColor }}>{text}</span>;
}`,
    ts: `import React from 'react';
{{CSS_IMPORT}}

interface BadgeProps {
  text: string;
  backgroundColor?: string;
  textColor?: string;
}

export default function Badge({ text, backgroundColor, textColor }: BadgeProps) {
  return <span className="{{WRAPPER_CLASS}}" style={{ backgroundColor, color: textColor }}>{text}</span>;
}`,
  },
};
