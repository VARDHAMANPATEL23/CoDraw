export const RadioDef = {
  type: 'Radio',
  category: 'Forms & Input',
  label: 'Radio',
  icon: 'disc-radio',
  defaultProps: {
    label: 'Radio Option',
    name: 'radioGroup',
    value: 'opt1',
  },
  propsSchema: [
    { key: 'label', label: 'Label', type: 'text' },
    { key: 'name', label: 'Group Name', type: 'text' },
    { key: 'value', label: 'Value', type: 'text' },
  ],
  styleMap: {
    tailwind: {
      wrapper: 'flex items-center space-x-2 my-2 cursor-pointer',
      label: 'text-sm text-slate-200',
      input: 'w-4 h-4 rounded-full bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500',
    },
    'css-modules': { wrapper: 'radio__wrapper', label: 'radio__label', input: 'radio__input' },
    bootstrap: { wrapper: 'form-check my-2', label: 'form-check-label', input: 'form-check-input' },
  },
  templates: {
    js: `import React from 'react';
{{CSS_IMPORT}}

export default function Radio({ label, name = 'radioGroup', value = 'opt1' }) {
  return (
    <label className="{{WRAPPER_CLASS}}">
      <input type="radio" name={name} value={value} className="{{INPUT_CLASS}}" />
      <span className="{{LABEL_CLASS}}">{label}</span>
    </label>
  );
}`,
    ts: `import React from 'react';
{{CSS_IMPORT}}

interface RadioProps {
  label: string;
  name?: string;
  value?: string;
}

export default function Radio({ label, name = 'radioGroup', value = 'opt1' }: RadioProps) {
  return (
    <label className="{{WRAPPER_CLASS}}">
      <input type="radio" name={name} value={value} className="{{INPUT_CLASS}}" />
      <span className="{{LABEL_CLASS}}">{label}</span>
    </label>
  );
}`,
  },
};
