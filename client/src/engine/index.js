import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { renderComponentFile } from './templateRenderer';
import { generateHomePage } from './pageGenerator';
import { generateScaffold } from './scaffoldGenerator';
import { generateStylesFiles } from './stylesGenerator';
import { generateReadme } from './readmeGenerator';

export async function exportProject(projectJSON) {
  const { meta, canvas } = projectJSON;
  const components = (canvas && canvas.components) || [];
  const rootFolderName = (meta.name || 'codraw-project').toLowerCase().replace(/[^a-z0-9]/g, '-');

  const zip = new JSZip();
  const folder = zip.folder(rootFolderName);

  // 1. Generate individual component files
  const uniqueTypes = Array.from(new Set(components.map((c) => c.type)));
  uniqueTypes.forEach((type) => {
    const compNode = components.find((c) => c.type === type);
    if (compNode) {
      const rendered = renderComponentFile(compNode, meta.language, meta.stylingSystem);
      if (rendered.filename) {
        folder.file(rendered.filename, rendered.content);
      }
    }
  });

  // 2. Generate Home page
  const homePage = generateHomePage(components, meta.language);
  folder.file(homePage.filename, homePage.content);

  // 3. Generate project scaffold (package.json, App, index, HTML)
  const scaffoldFiles = generateScaffold(meta);
  scaffoldFiles.forEach((file) => {
    folder.file(file.filename, file.content);
  });

  // 4. Generate styles files (tailwind.config, index.css, modules)
  const styleFiles = generateStylesFiles(components, meta.stylingSystem);
  styleFiles.forEach((file) => {
    folder.file(file.filename, file.content);
  });

  // 5. Generate README.md
  const readme = generateReadme(meta);
  folder.file(readme.filename, readme.content);

  // 6. Generate blob and trigger download
  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, `${rootFolderName}-export.zip`);
  return true;
}
