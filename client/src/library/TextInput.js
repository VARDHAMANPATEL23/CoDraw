export const TextInputDef = {
  type: 'TextInput',
  category: 'Forms & Input',
  label: 'Text Input',
  icon: 'input-text',
  defaultProps: {
    label: 'Email Address',
    placeholder: 'enter your email...',
    type: 'text',
  },
  propsSchema: [
    { key: 'label', label: 'Field Label', type: 'text' },
    { key: 'placeholder', label: 'Placeholder', type: 'text' },
    { key: 'type', label: 'Input Type', type: 'select', options: ['text', 'email', 'password', 'url'] },
  ],
  styleMap: {
    tailwind: {
      wrapper: 'flex flex-col space-y-1.5 w-full max-w-sm my-2',
      label: 'text-xs font-medium text-slate-300',
      input: 'px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-sm text-slate-100 focus:outline-none focus:border-indigo-500',
    },
    'css-modules': { wrapper: 'input__wrapper', label: 'input__label', input: 'input__field' },
    bootstrap: { wrapper: 'mb-3', label: 'form-label', input: 'form-control' },
  },
  templates: {
    js: `import React from 'react';
{{CSS_IMPORT}}

export default function TextInput({ label, placeholder, type = 'text' }) {
  return (
    <div className="{{WRAPPER_CLASS}}">
      {label && <label className="{{LABEL_CLASS}}">{label}</label>}
      <input type={type} placeholder={placeholder} className="{{INPUT_CLASS}}" />
    </div>
  );
}`,
    ts: `import React from 'react';
{{CSS_IMPORT}}

interface TextInputProps {
  label?: string;
  placeholder?: string;
  type?: string;
}

export default function TextInput({ label, placeholder, type = 'text' }: TextInputProps) {
  return (
    <div className="{{WRAPPER_CLASS}}">
      {label && <label className="{{LABEL_CLASS}}">{label}</label>}
      <input type={type} placeholder={placeholder} className="{{INPUT_CLASS}}" />
    </div>
  );
}`,
  },
};
