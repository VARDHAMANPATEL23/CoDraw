export function generateScaffold(meta) {
  const isTS = meta.language === 'ts';
  const stylingSystem = meta.stylingSystem || 'tailwind';
  const ext = isTS ? 'tsx' : 'js';

  // package.json dependencies based on styling system
  const dependencies = {
    react: '^18.2.0',
    'react-dom': '^18.2.0',
    'react-scripts': '5.0.1',
  };

  const devDependencies = {};

  if (isTS) {
    devDependencies['typescript'] = '^4.9.5';
    devDependencies['@types/react'] = '^18.0.28';
    devDependencies['@types/react-dom'] = '^18.0.11';
    devDependencies['@types/node'] = '^18.15.0';
  }

  if (stylingSystem === 'tailwind') {
    devDependencies['tailwindcss'] = '^3.3.0';
    devDependencies['postcss'] = '^8.4.21';
    devDependencies['autoprefixer'] = '^10.4.14';
  } else if (stylingSystem === 'bootstrap') {
    dependencies['bootstrap'] = '^5.2.3';
  }

  const packageJson = {
    name: meta.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    version: '0.1.0',
    private: true,
    dependencies,
    devDependencies,
    scripts: {
      start: 'react-scripts start',
      build: 'react-scripts build',
      test: 'react-scripts test',
      eject: 'react-scripts eject',
    },
    browserslist: {
      production: ['>0.2%', 'not dead', 'not op_mini all'],
      development: ['last 1 chrome version', 'last 1 firefox version', 'last 1 safari version'],
    },
  };

  const appContent = `import React from 'react';
import Home from './pages/Home';

function App() {
  return <Home />;
}

export default App;
`;

  const indexContent = `import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')${isTS ? '!' : ''});
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`;

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${meta.name}</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
`;

  return [
    { filename: 'package.json', content: JSON.stringify(packageJson, null, 2) },
    { filename: `src/App.${ext}`, content: appContent.trim() },
    { filename: `src/index.${ext}`, content: indexContent.trim() },
    { filename: 'public/index.html', content: htmlContent.trim() },
  ];
}
