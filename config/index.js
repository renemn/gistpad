const fs = require('fs-extra');
const path = require('path');

const pathsJSON = require('./paths.json');
const config = module.exports;

const INDEX_CSS = 'index.css';
const INDEX_HTML = 'index.html';
const INDEX_JS = 'index.js';

Object.assign(config, {
  cwd: null,
  debug: false,
  port: 3000,
  watcher: {
    glob: '**/*.(js|json|html|css)'
  },
});

config.setup = (options = {}) => (
  new Promise((resolve, reject) => {
    try {
      let renderersPath = null;

      Object.keys(options).forEach(key => {
        if (config.hasOwnProperty(key)) {
          config[key] = typeof options[key] === 'undefined' ?
            config[key] : options[key];
        }
      });

      if (!path.isAbsolute(config.cwd)) {
        config.cwd = path.normalize(path.join(process.cwd(), config.cwd));
      }

      config.paths = {};
      config.renderers = {};
      config.eslintErrors = {};

      Object.keys(pathsJSON).forEach(name => {
        config.paths[name] = path.resolve(config.cwd, pathsJSON[name]);
      });
      
      renderersPath = config.paths.renderers;
      fs
        .readdirSync(renderersPath)
        .filter(name => (
          fs.statSync(`${renderersPath}/${name}`).isDirectory() && !name.startsWith('_')
        ))
        .forEach(name => {
          const pathname = `${name}Renderer`;
          const rendererPath = path.resolve(renderersPath, name);
          config.renderers[name] = { pathname, active: false };
          config.paths[pathname] = {
            root: rendererPath,
            css: path.resolve(rendererPath, INDEX_CSS),
            html: path.resolve(rendererPath, INDEX_HTML),
            js: path.resolve(rendererPath, INDEX_JS),
          };
        });
      return resolve(config);
    } catch (err) {
      return reject(err);
    }
  })
);
