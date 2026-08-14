export const ImageComponentDef = {
  type: 'Image',
  category: 'Media',
  label: 'Image',
  icon: 'image',
  styleableElements: ['Wrapper'],
  defaultProps: {
    src: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800',
    alt: 'Sample Image',
    width: '100%',
    height: 'auto',
    borderRadius: '8px',
    innerStyles: {},
  },
  propsSchema: [
    { key: 'src', label: 'Image URL', type: 'text' },
    { key: 'alt', label: 'Alt Text', type: 'text' },
    { key: 'width', label: 'Width', type: 'text' },
    { key: 'borderRadius', label: 'Border Radius', type: 'text' },
  ],
  styleMap: {
    tailwind: { wrapper: 'object-cover my-2 shadow-md' },
    'css-modules': { wrapper: 'image__wrapper' },
    bootstrap: { wrapper: 'img-fluid rounded' },
  },
  templates: {
    js: `import React from 'react';
{{CSS_IMPORT}}

export default function Image({ src, alt = 'Image', width = '100%', borderRadius = '8px' }) {
  return <img src={src} alt={alt} className="{{WRAPPER_CLASS}}" style={{ width, borderRadius }} />;
}`,
    ts: `import React from 'react';
{{CSS_IMPORT}}

interface ImageProps {
  src: string;
  alt?: string;
  width?: string;
  borderRadius?: string;
}

export default function Image({ src, alt = 'Image', width = '100%', borderRadius = '8px' }: ImageProps) {
  return <img src={src} alt={alt} className="{{WRAPPER_CLASS}}" style={{ width, borderRadius }} />;
}`,
  },
};
