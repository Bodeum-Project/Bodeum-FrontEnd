import { readFileSync, writeFileSync } from 'node:fs';
import { URL } from 'node:url';

const read = path => readFileSync(new URL(path, import.meta.url), 'utf8');
const html = read('./dist/index.html');
const scriptTag = /<script type="module" crossorigin src="([^"]+)"><\/script>/;
const cssTag = /<link rel="stylesheet" crossorigin href="([^"]+)">/;
const scriptPath = html.match(scriptTag)?.[1];
const cssPath = html.match(cssTag)?.[1];

if (!scriptPath || !cssPath) throw new Error('Run the production build before exporting.');

const logo = readFileSync(new URL('./src/logo-bodeum.png', import.meta.url)).toString('base64');
const script = read('./dist/' + scriptPath)
  .replace(/new URL\("[^"]*logo-bodeum[^"]*\.png",import\.meta\.url\)\.href/g, JSON.stringify('data:image/png;base64,' + logo))
  .replace(/<\/script/gi, '<\\/script');
const css = read('./dist/' + cssPath).replace(/@font-face\{[^}]*\}/g, '');
const preview = html
  .replace(scriptTag, () => '<script type="module">' + script + '</script>')
  .replace(cssTag, () => '<style>' + css + '</style>');

writeFileSync(new URL('./preview.html', import.meta.url), preview);
