export const ButtonDef = {
  type: 'Button',
  category: 'Forms & Input',
  label: 'Button',
  icon: 'square-button',
  defaultProps: {
    text: 'Click Me',
    variant: 'primary',
    backgroundColor: '#6366f1',
    textColor: '#ffffff',
  },
  propsSchema: [
    { key: 'text', label: 'Button Label', type: 'text' },
    { key: 'variant', label: 'Variant', type: 'select', options: ['primary', 'secondary', 'outline'] },
    { key: 'backgroundColor', label: 'Background', type: 'color' },
    { key: 'textColor', label: 'Text Color', type: 'color' },
  ],
  styleMap: {
    tailwind: {
      wrapper: 'inline-flex items-center justify-center font-medium px-4 py-2 rounded-md shadow-sm transition-colors cursor-pointer',
    },
    'css-modules': {
      wrapper: 'btn__wrapper',
    },
    bootstrap: {
      wrapper: 'btn btn-primary',
    },
  },
  templates: {
    js: `import React from 'react';
{{CSS_IMPORT}}

export default function Button({ text, backgroundColor, textColor }) {
  return (
    <button className="{{WRAPPER_CLASS}}" style={{ backgroundColor, color: textColor }}>
      {text}
    </button>
  );
}`,
    ts: `import React from 'react';
{{CSS_IMPORT}}

interface ButtonProps {
  text: string;
  backgroundColor: string;
  textColor: string;
}

export default function Button({ text, backgroundColor, textColor }: ButtonProps) {
  return (
    <button className="{{WRAPPER_CLASS}}" style={{ backgroundColor, color: textColor }}>
      {text}
    </button>
  );
}`,
  },
};
