export const HeadingDef = {
  type: 'Heading',
  category: 'Typography',
  label: 'Heading',
  icon: 'heading-text',
  styleableElements: ['Wrapper'],
  defaultProps: {
    text: 'Section Heading',
    level: 'h2',
    textColor: '#f8fafc',
    innerStyles: {},
  },
  propsSchema: [
    { key: 'text', label: 'Heading Text', type: 'text' },
    { key: 'level', label: 'Level (h1-h6)', type: 'select', options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] },
    { key: 'textColor', label: 'Text Color', type: 'color' },
  ],
  styleMap: {
    tailwind: { wrapper: 'font-bold tracking-tight my-3' },
    'css-modules': { wrapper: 'heading__wrapper' },
    bootstrap: { wrapper: 'h2 font-weight-bold' },
  },
  templates: {
    js: `import React from 'react';
{{CSS_IMPORT}}

export default function Heading({ text, level = 'h2', textColor }) {
  const Tag = level;
  return <Tag className="{{WRAPPER_CLASS}}" style={{ color: textColor }}>{text}</Tag>;
}`,
    ts: `import React from 'react';
{{CSS_IMPORT}}

interface HeadingProps {
  text: string;
  level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  textColor?: string;
}

export default function Heading({ text, level = 'h2', textColor }: HeadingProps) {
  const Tag = level;
  return <Tag className="{{WRAPPER_CLASS}}" style={{ color: textColor }}>{text}</Tag>;
}`,
  },
};
