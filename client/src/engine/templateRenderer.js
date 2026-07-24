import { getComponentDef } from '../library';

export function renderComponentFile(compNode, language = 'js', stylingSystem = 'tailwind') {
  const def = getComponentDef(compNode.type);
  if (!def) return { filename: '', content: '' };

  const isTS = language === 'ts';
  const ext = isTS ? 'tsx' : 'jsx';
  const filename = `src/components/${def.type}.${ext}`;

  let template = def.templates[isTS ? 'ts' : 'js'] || '';
  const props = compNode.props || def.defaultProps;

  // 1. Resolve {{CSS_IMPORT}}
  let cssImport = '';
  if (stylingSystem === 'css-modules') {
    cssImport = `import styles from './${def.type}.module.css';`;
  }
  template = template.replace(/{{CSS_IMPORT}}/g, cssImport);

  // 2. Resolve styleMap placeholders
  const systemStyles = (def.styleMap && def.styleMap[stylingSystem]) || {};
  Object.keys(systemStyles).forEach((classKey) => {
    const placeholder = new RegExp(`{{${classKey.toUpperCase()}_CLASS}}`, 'g');
    let classVal = systemStyles[classKey];
    if (stylingSystem === 'css-modules') {
      classVal = `{styles.${classVal}}`;
    }
    template = template.replace(placeholder, classVal);
  });

  return {
    componentName: def.type,
    filename,
    content: template.trim(),
    props,
  };
}
