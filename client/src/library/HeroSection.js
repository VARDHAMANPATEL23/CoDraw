export const HeroSectionDef = {
  type: 'HeroSection',
  category: 'UI Blocks',
  label: 'Hero Section',
  icon: 'layout-hero',
  styleableElements: ['Wrapper', 'Title', 'Subtitle', 'CTA'],
  defaultProps: {
    title: 'Build Visually, Export Clean React',
    subtitle: 'Drag and drop components to visually generate clean codebases.',
    ctaText: 'Get Started',
    backgroundColor: 'transparent',
    textColor: '#ffffff',
    linkTo: '',
    innerStyles: {},
  },
  propsSchema: [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'subtitle', label: 'Subtitle', type: 'text' },
    { key: 'ctaText', label: 'Button Text', type: 'text' },
    { key: 'backgroundColor', label: 'Background', type: 'color' },
    { key: 'textColor', label: 'Text Color', type: 'color' },
    { key: 'linkTo', label: 'Link URL (for MPA)', type: 'text' },
  ],
  styleMap: {
    tailwind: {
      wrapper: 'flex flex-col items-center justify-center text-center py-32 px-6 w-full min-h-[60vh] bg-gradient-to-br from-slate-900 to-slate-950 relative overflow-hidden',
      title: 'text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400',
      subtitle: 'text-lg md:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed',
      cta: 'bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-4 rounded-xl shadow-[0_0_40px_-10px_rgba(79,70,229,0.5)] transition-all hover:scale-105 active:scale-95 inline-block no-underline',
    },
    'css-modules': {
      wrapper: 'hero__wrapper',
      title: 'hero__title',
      subtitle: 'hero__subtitle',
      cta: 'hero__cta',
    },
    bootstrap: {
      wrapper: 'jumbotron text-center py-5 px-3 bg-dark text-white',
      title: 'display-4 font-weight-bold mb-3',
      subtitle: 'lead text-muted mb-4',
      cta: 'btn btn-primary btn-lg shadow',
    },
  },
  templates: {
    js: `import React from 'react';
{{CSS_IMPORT}}

export default function HeroSection({ title, subtitle, ctaText, backgroundColor, textColor, linkTo, innerStyles = {} }) {
  const getInnerStyle = (elName) => innerStyles[elName] || {};
  return (
    <section className="{{WRAPPER_CLASS}}" style={{ backgroundColor, color: textColor, ...getInnerStyle('Wrapper') }}>
      <h1 className="{{TITLE_CLASS}}" style={getInnerStyle('Title')}>{title}</h1>
      <p className="{{SUBTITLE_CLASS}}" style={getInnerStyle('Subtitle')}>{subtitle}</p>
      {linkTo ? (
        <a href={linkTo} className="{{CTA_CLASS}}" style={getInnerStyle('CTA')}>{ctaText}</a>
      ) : (
        <button className="{{CTA_CLASS}}" style={getInnerStyle('CTA')}>{ctaText}</button>
      )}
    </section>
  );
}`,
    ts: `import React from 'react';
{{CSS_IMPORT}}

interface HeroSectionProps {
  title: string;
  subtitle: string;
  ctaText: string;
  backgroundColor?: string;
  textColor?: string;
  linkTo?: string;
  innerStyles?: Record<string, React.CSSProperties>;
}

export default function HeroSection({ title, subtitle, ctaText, backgroundColor, textColor, linkTo, innerStyles = {} }: HeroSectionProps) {
  const getInnerStyle = (elName: string) => innerStyles[elName] || {};
  return (
    <section className="{{WRAPPER_CLASS}}" style={{ backgroundColor, color: textColor, ...getInnerStyle('Wrapper') }}>
      <h1 className="{{TITLE_CLASS}}" style={getInnerStyle('Title')}>{title}</h1>
      <p className="{{SUBTITLE_CLASS}}" style={getInnerStyle('Subtitle')}>{subtitle}</p>
      {linkTo ? (
        <a href={linkTo} className="{{CTA_CLASS}}" style={getInnerStyle('CTA')}>{ctaText}</a>
      ) : (
        <button className="{{CTA_CLASS}}" style={getInnerStyle('CTA')}>{ctaText}</button>
      )}
    </section>
  );
}`,
  },
};
