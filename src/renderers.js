import path from 'path';
import url from 'url';
import { BrowserWindow } from 'electron';

const _options = new Map();
const _actives = new Map();

const getRendererUrlFromName = (name) => {
  if (process.env.NODE_ENV === 'development') {
    return `http://localhost:3000/${name}/index.html`;
  }
  return url.format({
    pathname: path.resolve('.', `build/renderers/${name}/index.html`),
    protocol: 'file:',
    slashes: true,
  });
};

const renderers = Object.create(null);

renderers.create = (name, opts) => {
  if (_options.has(name)) {
    throw new Error(`"${name}" renderer already exists.`);
  }
  _options.set(name, opts);
  return renderers;
}
