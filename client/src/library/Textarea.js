export const TextareaDef = {
  type: 'Textarea',
  category: 'Forms & Input',
  label: 'Textarea',
  icon: 'input-textarea',
  defaultProps: {
    label: 'Message',
    placeholder: 'Type your message...',
    rows: 4,
  },
  propsSchema: [
    { key: 'label', label: 'Field Label', type: 'text' },
    { key: 'placeholder', label: 'Placeholder', type: 'text' },
    { key: 'rows', label: 'Rows', type: 'number' },
  ],
  styleMap: {
    tailwind: {
      wrapper: 'flex flex-col space-y-1.5 w-full max-w-sm my-2',
      label: 'text-xs font-medium text-slate-300',
      input: 'px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-sm text-slate-100 focus:outline-none focus:border-indigo-500',
    },
    'css-modules': { wrapper: 'textarea__wrapper', label: 'textarea__label', input: 'textarea__field' },
    bootstrap: { wrapper: 'mb-3', label: 'form-label', input: 'form-control' },
  },
  templates: {
    js: `import React from 'react';
{{CSS_IMPORT}}

export default function Textarea({ label, placeholder, rows = 4 }) {
  return (
    <div className="{{WRAPPER_CLASS}}">
      {label && <label className="{{LABEL_CLASS}}">{label}</label>}
      <textarea rows={rows} placeholder={placeholder} className="{{INPUT_CLASS}}" />
    </div>
  );
}`,
    ts: `import React from 'react';
{{CSS_IMPORT}}

interface TextareaProps {
  label?: string;
  placeholder?: string;
  rows?: number;
}

export default function Textarea({ label, placeholder, rows = 4 }: TextareaProps) {
  return (
    <div className="{{WRAPPER_CLASS}}">
      {label && <label className="{{LABEL_CLASS}}">{label}</label>}
      <textarea rows={rows} placeholder={placeholder} className="{{INPUT_CLASS}}" />
    </div>
  );
}`,
  },
};
