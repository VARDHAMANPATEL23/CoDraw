import { getComponentDef } from '../library';

export function generateStylesFiles(components, stylingSystem = 'tailwind') {
  const files = [];

  if (stylingSystem === 'tailwind') {
    files.push({
      filename: 'tailwind.config.js',
      content: `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};`,
    });

    files.push({
      filename: 'src/index.css',
      content: `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}`,
    });
  } else if (stylingSystem === 'css-modules') {
    files.push({
      filename: 'src/index.css',
      content: `body {
  margin: 0;
  font-family: sans-serif;
  background-color: #0f172a;
  color: #f8fafc;
}`,
    });

    const uniqueTypes = Array.from(new Set(components.map((c) => c.type)));
    uniqueTypes.forEach((type) => {
      const def = getComponentDef(type);
      if (def && def.styleMap && def.styleMap['css-modules']) {
        const cssClasses = Object.values(def.styleMap['css-modules'])
          .map((cls) => `.${cls} {\n  /* styles for ${cls} */\n}`)
          .join('\n\n');

        files.push({
          filename: `src/components/${type}.module.css`,
          content: cssClasses,
        });
      }
    });
  } else if (stylingSystem === 'bootstrap') {
    files.push({
      filename: 'src/index.css',
      content: `@import 'bootstrap/dist/css/bootstrap.min.css';

body {
  margin: 0;
}`,
    });
  }

  return files;
}
