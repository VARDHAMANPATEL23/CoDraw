export const CheckboxDef = {
  type: 'Checkbox',
  category: 'Forms & Input',
  label: 'Checkbox',
  icon: 'check-square',
  defaultProps: {
    label: 'I accept the terms and conditions',
    checked: false,
  },
  propsSchema: [
    { key: 'label', label: 'Checkbox Label', type: 'text' },
    { key: 'checked', label: 'Default Checked', type: 'boolean' },
  ],
  styleMap: {
    tailwind: {
      wrapper: 'flex items-center space-x-2 my-2 cursor-pointer',
      label: 'text-sm text-slate-200',
      input: 'w-4 h-4 rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500',
    },
    'css-modules': { wrapper: 'checkbox__wrapper', label: 'checkbox__label', input: 'checkbox__input' },
    bootstrap: { wrapper: 'form-check my-2', label: 'form-check-label', input: 'form-check-input' },
  },
  templates: {
    js: `import React from 'react';
{{CSS_IMPORT}}

export default function Checkbox({ label, checked = false }) {
  return (
    <label className="{{WRAPPER_CLASS}}">
      <input type="checkbox" defaultChecked={checked} className="{{INPUT_CLASS}}" />
      <span className="{{LABEL_CLASS}}">{label}</span>
    </label>
  );
}`,
    ts: `import React from 'react';
{{CSS_IMPORT}}

interface CheckboxProps {
  label: string;
  checked?: boolean;
}

export default function Checkbox({ label, checked = false }: CheckboxProps) {
  return (
    <label className="{{WRAPPER_CLASS}}">
      <input type="checkbox" defaultChecked={checked} className="{{INPUT_CLASS}}" />
      <span className="{{LABEL_CLASS}}">{label}</span>
    </label>
  );
}`,
  },
};
