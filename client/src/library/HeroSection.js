export const HeroSectionDef = {
  type: 'HeroSection',
  category: 'UI Blocks',
  label: 'Hero Section',
  icon: 'layout-hero',
  defaultProps: {
    title: 'Build Visually, Export Clean React',
    subtitle: 'Drag and drop components to visually generate clean codebases.',
    ctaText: 'Get Started',
    backgroundColor: '#1e293b',
    textColor: '#ffffff',
  },
  propsSchema: [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'subtitle', label: 'Subtitle', type: 'text' },
    { key: 'ctaText', label: 'Button Text', type: 'text' },
    { key: 'backgroundColor', label: 'Background', type: 'color' },
    { key: 'textColor', label: 'Text Color', type: 'color' },
  ],
  styleMap: {
    tailwind: {
      wrapper: 'flex flex-col items-center justify-center text-center py-20 px-6 w-full',
      title: 'text-4xl font-extrabold tracking-tight mb-4',
      subtitle: 'text-lg text-slate-300 max-w-2xl mb-8',
      cta: 'bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-all',
    },
    'css-modules': {
      wrapper: 'hero__wrapper',
      title: 'hero__title',
      subtitle: 'hero__subtitle',
      cta: 'hero__cta',
    },
    bootstrap: {
      wrapper: 'jumbotron text-center py-5 px-3',
      title: 'display-4 font-weight-bold mb-3',
      subtitle: 'lead text-muted mb-4',
      cta: 'btn btn-primary btn-lg',
    },
  },
  templates: {
    js: `import React from 'react';
{{CSS_IMPORT}}

export default function HeroSection({ title, subtitle, ctaText, backgroundColor, textColor }) {
  return (
    <section className="{{WRAPPER_CLASS}}" style={{ backgroundColor, color: textColor }}>
      <h1 className="{{TITLE_CLASS}}">{title}</h1>
      <p className="{{SUBTITLE_CLASS}}">{subtitle}</p>
      <button className="{{CTA_CLASS}}">{ctaText}</button>
    </section>
  );
}`,
    ts: `import React from 'react';
{{CSS_IMPORT}}

interface HeroSectionProps {
  title: string;
  subtitle: string;
  ctaText: string;
  backgroundColor: string;
  textColor: string;
}

export default function HeroSection({ title, subtitle, ctaText, backgroundColor, textColor }: HeroSectionProps) {
  return (
    <section className="{{WRAPPER_CLASS}}" style={{ backgroundColor, color: textColor }}>
      <h1 className="{{TITLE_CLASS}}">{title}</h1>
      <p className="{{SUBTITLE_CLASS}}">{subtitle}</p>
      <button className="{{CTA_CLASS}}">{ctaText}</button>
    </section>
  );
}`,
  },
};
