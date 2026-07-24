import { getComponentDef } from '../library';

export function generateHomePage(components, language = 'js') {
  const isTS = language === 'ts';
  const ext = isTS ? 'tsx' : 'jsx';
  const filename = `src/pages/Home.${ext}`;

  // Unique component types used
  const uniqueTypes = Array.from(new Set(components.map((c) => c.type)));

  const imports = uniqueTypes
    .map((type) => `import ${type} from '../components/${type}';`)
    .join('\n');

  const jsxElements = components
    .map((comp) => {
      const def = getComponentDef(comp.type);
      if (!def) return null;

      const props = comp.props || def.defaultProps;
      const propPairs = Object.entries(props)
        .map(([key, value]) => {
          if (typeof value === 'string') return `${key}="${value}"`;
          if (typeof value === 'boolean' || typeof value === 'number') return `${key}={${value}}`;
          if (Array.isArray(value)) return `${key}={${JSON.stringify(value)}}`;
          return `${key}={${JSON.stringify(value)}}`;
        })
        .join(' ');

      return `      <${comp.type} ${propPairs} />`;
    })
    .filter(Boolean)
    .join('\n');

  const content = `import React from 'react';
${imports}

export default function Home() {
  return (
    <main className="min-h-screen">
${jsxElements || '      <div>No components added yet.</div>'}
    </main>
  );
}
`;

  return { filename, content: content.trim() };
}
