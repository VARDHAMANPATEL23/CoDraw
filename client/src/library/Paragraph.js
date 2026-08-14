export const ParagraphDef = {
  type: 'Paragraph',
  category: 'Typography',
  label: 'Paragraph',
  icon: 'text-paragraph',
  styleableElements: ['Wrapper'],
  defaultProps: {
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    fontSize: '16px',
    textColor: '#cbd5e1',
    innerStyles: {},
  },
  propsSchema: [
    { key: 'content', label: 'Content Text', type: 'text' },
    { key: 'fontSize', label: 'Font Size', type: 'text' },
    { key: 'textColor', label: 'Text Color', type: 'color' },
  ],
  styleMap: {
    tailwind: {
      wrapper: 'text-base leading-relaxed my-2',
    },
    'css-modules': {
      wrapper: 'paragraph__wrapper',
    },
    bootstrap: {
      wrapper: 'lead',
    },
  },
  templates: {
    js: `import React from 'react';
{{CSS_IMPORT}}

export default function Paragraph({ content, fontSize, textColor }) {
  return (
    <p className="{{WRAPPER_CLASS}}" style={{ fontSize, color: textColor }}>
      {content}
    </p>
  );
}`,
    ts: `import React from 'react';
{{CSS_IMPORT}}

interface ParagraphProps {
  content: string;
  fontSize: string;
  textColor: string;
}

export default function Paragraph({ content, fontSize, textColor }: ParagraphProps) {
  return (
    <p className="{{WRAPPER_CLASS}}" style={{ fontSize, color: textColor }}>
      {content}
    </p>
  );
}`,
  },
};
