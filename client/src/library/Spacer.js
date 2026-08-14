export const SpacerDef = {
  type: 'Spacer',
  category: 'Layout',
  label: 'Spacer',
  icon: 'space-y',
  styleableElements: ['Wrapper'],
  defaultProps: {
    height: '32px',
    innerStyles: {},
  },
  propsSchema: [
    { key: 'height', label: 'Height', type: 'text' },
  ],
  styleMap: {
    tailwind: { wrapper: 'w-full' },
    'css-modules': { wrapper: 'spacer__wrapper' },
    bootstrap: { wrapper: 'w-100' },
  },
  templates: {
    js: `import React from 'react';
{{CSS_IMPORT}}

export default function Spacer({ height }) {
  return <div className="{{WRAPPER_CLASS}}" style={{ height }} />;
}`,
    ts: `import React from 'react';
{{CSS_IMPORT}}

interface SpacerProps {
  height?: string;
}

export default function Spacer({ height }: SpacerProps) {
  return <div className="{{WRAPPER_CLASS}}" style={{ height }} />;
}`,
  },
};
