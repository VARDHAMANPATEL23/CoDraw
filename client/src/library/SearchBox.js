export const SearchBoxDef = {
  type: 'SearchBox',
  category: 'Forms & Input',
  label: 'Search Box',
  icon: 'search',
  styleableElements: ['Wrapper'],
  defaultProps: {
    placeholder: 'Search...',
    innerStyles: {},
  },
  propsSchema: [
    { key: 'placeholder', label: 'Placeholder', type: 'text' },
  ],
  styleMap: {
    tailwind: {
      wrapper: 'relative w-full max-w-sm my-2',
      input: 'w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-indigo-500',
    },
    'css-modules': { wrapper: 'search__wrapper', input: 'search__input' },
    bootstrap: { wrapper: 'input-group my-2', input: 'form-control' },
  },
  templates: {
    js: `import React from 'react';
{{CSS_IMPORT}}

export default function SearchBox({ placeholder = 'Search...' }) {
  return (
    <div className="{{WRAPPER_CLASS}}">
      <input type="search" placeholder={placeholder} className="{{INPUT_CLASS}}" />
    </div>
  );
}`,
    ts: `import React from 'react';
{{CSS_IMPORT}}

interface SearchBoxProps {
  placeholder?: string;
}

export default function SearchBox({ placeholder = 'Search...' }: SearchBoxProps) {
  return (
    <div className="{{WRAPPER_CLASS}}">
      <input type="search" placeholder={placeholder} className="{{INPUT_CLASS}}" />
    </div>
  );
}`,
  },
};
