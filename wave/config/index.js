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
      config.bundles = {};
      config.eslintErrors = {};
      config.renderers = [];
      config.watcher = null;

      Object.keys(pathsJSON).forEach(name => {
        config.paths[name] = path.resolve(config.cwd, pathsJSON[name]);
      });

      config.package = JSON.parse(fs.readFileSync(config.paths.package, 'utf-8'));
      
      config.paths.main = {};
      config.paths.main.root = config.paths.src;
      config.paths.main.js = path.resolve(config.paths.main.root, INDEX_JS);

      config.paths.renderers = {};
      config.paths.renderers.root = config.paths.src;

      renderersPath = config.paths.renderers.root;

      fs
        .readdirSync(renderersPath)
        .filter(name => (
          fs.statSync(`${renderersPath}/${name}`).isDirectory() &&
          !name.startsWith('_') &&
          name !== 'root'
        ))
        .forEach(name => {
          const rendererPath = path.resolve(renderersPath, name);
          config.renderers.push(name);
          config.paths.renderers[name] = {
            root: rendererPath,
            css: path.resolve(rendererPath, INDEX_CSS),
            html: path.resolve(rendererPath, INDEX_HTML),
            js: path.resolve(rendererPath, INDEX_JS),
          };
        });

      resolve(config);
    } catch (err) {
      reject(err);
    }
  })
);
