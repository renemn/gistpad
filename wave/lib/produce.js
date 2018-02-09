const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const config = require('../config');
const log = require('../utils/log');
const compileJS = require('./compileJS');
const compileCSS = require('./compileCSS');

const produce = module.exports;

const replaceSrc = (src) => (
  src.replace(config.paths.src, config.paths.build)
);

const resolvePaths = (directory, dependencies) => {
  const result = dependencies.map((dependency) => (
    path.resolve(directory, dependency)
  ));
  return result;
};

produce.buildScriptForMain = (name = 'main') => (
  new Promise((resolve) => {
    const src = config.paths.main.js;
    const target = replaceSrc(src);
    let bundle = null;
    fs.ensureFile(target)
      .then(() => compileJS(src))
      .then(({ code, cache, map }) => {
        const dependencies = resolvePaths(path.dirname(src), map.sources);
        bundle = { context: name, name, type: 'js', src, target, dependencies, code, cache };
        return fs.writeFile(target, code);
      })
      .then(() => resolve(bundle));
  })
);

produce.buildScriptForRenderer = (name) => (
  new Promise((resolve) => {
    const src = config.paths.renderers[name].js;
    const target = replaceSrc(src);
    let bundle = null;
    fs.ensureFile(target)
      .then(() => compileJS(src))
      .then(({ code, cache, map }) => {
        const context = 'renderer';
        const dependencies = resolvePaths(path.dirname(src), map.sources);
        bundle = { context, name, type: 'js', src, target, dependencies, code, cache };
        return fs.writeFile(target, code);
      })
      .then(() => resolve(bundle));
  })
);

produce.buildStyleForRenderer = (name) => (
  new Promise((resolve) => {
    const src = config.paths.renderers[name].css;
    const target = replaceSrc(src);
    let bundle = null;
    fs.ensureFile(target)
      .then(() => compileCSS(src))
      .then(({ css: code, messages }) => {
        const context = 'renderer';
        const dependencies = [];
        messages.forEach(({ type, file }) => { if (type === 'dependency') dependencies.push(file); });
        dependencies.push(src);
        bundle = { context, name, type: 'css', src, target, dependencies, code, cache: null };
        return fs.writeFile(target, code);
      })
      .then(() => resolve(bundle));
  })
);

produce.buildMarkupForRenderer = (name) => (
  new Promise((resolve) => {
    const src = config.paths.renderers[name].html;
    const target = replaceSrc(src);
    fs.copy(src, target)
      .then(() => resolve({
        context: 'renderer', name, type: 'html', src, target, code: null, cache: null
      }));
  })
);

produce.buildScriptsForRenderers = () => (
  config.renderers.map(produce.buildScriptForRenderer)
);

produce.buildStylesForRenderers = () => (
  config.renderers.map(produce.buildStyleForRenderer)
);

produce.buildMarkupsForRenderers = () => (
  config.renderers.map(produce.buildMarkupForRenderer)
);

produce.all = () => (
  new Promise((resolve, reject) => {
    log('Producing bundles for scripts and styles...');

    const { build: buildSrc } = config.paths;
    Promise.resolve()
      .then(() => fs.ensureDir(buildSrc))
      .then(() => fs.emptyDir(buildSrc))
      .then(() => Promise.all([].concat.apply([], [
        produce.buildMarkupsForRenderers(),
        produce.buildStylesForRenderers(),
        produce.buildScriptsForRenderers(),
        produce.buildScriptForMain()
      ])))
      .then((allBundles) => {
        const eslintErrorsKeys = Object.keys(config.eslintErrors);
        if (eslintErrorsKeys.length > 0) {
          log.error('ESLint errors found: ↴\n');
          eslintErrorsKeys.forEach((key) => {
            console.log(config.eslintErrors[key]); // eslint-disable-line
          });
          if (process.env.NODE_ENV === 'production') {
            return reject();
          }
        }
        allBundles.forEach(({ src, ...rest }) => {
          config.bundles[src] = rest;
        });
        resolve();
      })
      .catch((err) => reject(err));
  })
);
