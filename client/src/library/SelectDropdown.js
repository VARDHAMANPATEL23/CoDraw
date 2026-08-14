export const SelectDropdownDef = {
  type: 'SelectDropdown',
  category: 'Forms & Input',
  label: 'Select Dropdown',
  icon: 'chevron-down',
  styleableElements: ['Wrapper'],
  defaultProps: {
    label: 'Choose Option',
    options: ['Option 1', 'Option 2', 'Option 3'],
    innerStyles: {},
  },
  propsSchema: [
    { key: 'label', label: 'Field Label', type: 'text' },
    { key: 'options', label: 'Options List', type: 'array-text' },
  ],
  styleMap: {
    tailwind: {
      wrapper: 'flex flex-col space-y-1.5 w-full max-w-sm my-2',
      label: 'text-xs font-medium text-slate-300',
      input: 'px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-sm text-slate-100 focus:outline-none focus:border-indigo-500',
    },
    'css-modules': { wrapper: 'select__wrapper', label: 'select__label', input: 'select__field' },
    bootstrap: { wrapper: 'mb-3', label: 'form-label', input: 'form-select' },
  },
  templates: {
    js: `import React from 'react';
{{CSS_IMPORT}}

export default function SelectDropdown({ label, options = [] }) {
  return (
    <div className="{{WRAPPER_CLASS}}">
      {label && <label className="{{LABEL_CLASS}}">{label}</label>}
      <select className="{{INPUT_CLASS}}">
        {options.map((opt, i) => (
          <option key={i} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}`,
    ts: `import React from 'react';
{{CSS_IMPORT}}

interface SelectDropdownProps {
  label?: string;
  options?: string[];
}

export default function SelectDropdown({ label, options = [] }: SelectDropdownProps) {
  return (
    <div className="{{WRAPPER_CLASS}}">
      {label && <label className="{{LABEL_CLASS}}">{label}</label>}
      <select className="{{INPUT_CLASS}}">
        {options.map((opt, i) => (
          <option key={i} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}`,
  },
};
