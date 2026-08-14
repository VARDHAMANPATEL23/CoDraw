export const NumberInputDef = {
  type: 'NumberInput',
  category: 'Forms & Input',
  label: 'Number Input',
  icon: 'input-number',
  styleableElements: ['Wrapper'],
  defaultProps: {
    label: 'Quantity',
    min: 0,
    max: 100,
    step: 1,
    innerStyles: {},
  },
  propsSchema: [
    { key: 'label', label: 'Field Label', type: 'text' },
    { key: 'min', label: 'Minimum', type: 'number' },
    { key: 'max', label: 'Maximum', type: 'number' },
    { key: 'step', label: 'Step', type: 'number' },
  ],
  styleMap: {
    tailwind: {
      wrapper: 'flex flex-col space-y-1.5 w-full max-w-xs my-2',
      label: 'text-xs font-medium text-slate-300',
      input: 'px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-sm text-slate-100 focus:outline-none focus:border-indigo-500',
    },
    'css-modules': { wrapper: 'numinput__wrapper', label: 'numinput__label', input: 'numinput__field' },
    bootstrap: { wrapper: 'mb-3', label: 'form-label', input: 'form-control' },
  },
  templates: {
    js: `import React from 'react';
{{CSS_IMPORT}}

export default function NumberInput({ label, min = 0, max = 100, step = 1 }) {
  return (
    <div className="{{WRAPPER_CLASS}}">
      {label && <label className="{{LABEL_CLASS}}">{label}</label>}
      <input type="number" min={min} max={max} step={step} className="{{INPUT_CLASS}}" />
    </div>
  );
}`,
    ts: `import React from 'react';
{{CSS_IMPORT}}

interface NumberInputProps {
  label?: string;
  min?: number;
  max?: number;
  step?: number;
}

export default function NumberInput({ label, min = 0, max = 100, step = 1 }: NumberInputProps) {
  return (
    <div className="{{WRAPPER_CLASS}}">
      {label && <label className="{{LABEL_CLASS}}">{label}</label>}
      <input type="number" min={min} max={max} step={step} className="{{INPUT_CLASS}}" />
    </div>
  );
}`,
  },
};
