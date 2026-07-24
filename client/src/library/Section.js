export const SectionDef = {
  type: 'Section',
  category: 'Layout',
  label: 'Section',
  icon: 'layout-section',
  defaultProps: {
    padding: 'py-12 px-6',
    backgroundColor: '#0f172a',
  },
  propsSchema: [
    { key: 'padding', label: 'Padding Class', type: 'text' },
    { key: 'backgroundColor', label: 'Background Color', type: 'color' },
  ],
  styleMap: {
    tailwind: { wrapper: 'w-full my-4 rounded-lg border border-slate-800 p-6' },
    'css-modules': { wrapper: 'section__wrapper' },
    bootstrap: { wrapper: 'container-fluid py-4' },
  },
  templates: {
    js: `import React from 'react';
{{CSS_IMPORT}}

export default function Section({ children, backgroundColor }) {
  return (
    <section className="{{WRAPPER_CLASS}}" style={{ backgroundColor }}>
      {children}
    </section>
  );
}`,
    ts: `import React from 'react';
{{CSS_IMPORT}}

interface SectionProps {
  children?: React.ReactNode;
  backgroundColor?: string;
}

export default function Section({ children, backgroundColor }: SectionProps) {
  return (
    <section className="{{WRAPPER_CLASS}}" style={{ backgroundColor }}>
      {children}
    </section>
  );
}`,
  },
};
