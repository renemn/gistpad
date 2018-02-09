const fs = require('fs-extra');
const path = require('path');
const config = require('../config');
const log = require('../utils/log');
const compileJS = require('./compileJS');
const compileCSS = require('./compileCSS');

const produce = module.exports;

const replaceSrc = (src) => (
  src.replace(config.paths.src, config.paths.build)
);

produce.buildScriptForMain = (name = 'main') => (
  new Promise((resolve, reject) => {
    const src = config.paths.main.js;
    const target = replaceSrc(src);
    let bundle = null;
    fs.ensureFile(target)
      .then(() => compileJS(src))
      .then(({ code, cache }) => {
        bundle = { context: name, name, type: 'js', src, target, code, cache };
        return fs.writeFile(target, code);
      })
      .then(() => resolve(bundle));
  })
);

produce.buildScriptForRenderer = (name) => (
  new Promise((resolve, reject) => {
    const src = config.paths.renderers[name].js;
    const target = replaceSrc(src);
    let bundle = null;
    fs.ensureFile(target)
      .then(() => compileJS(src))
      .then(({ code, cache }) => {
        bundle = { context: 'renderer', name, type: 'js', src, target, code, cache };
        return fs.writeFile(target, code);
      })
      .then(() => resolve(bundle));
  })
);

produce.buildStyleForRenderer = (name) => (
  new Promise((resolve, reject) => {
    const src = config.paths.renderers[name].css;
    const target = replaceSrc(src);
    let bundle = null;
    fs.ensureFile(target)
      .then(() => compileCSS(src))
      .then(({ css: code }) => {
        bundle = { context: 'renderer', name, type: 'css', src, target, code, cache: null };
        return fs.writeFile(target, code);
      })
      .then(() => resolve(bundle));
  })
);

produce.buildMarkupForRenderer = (name) => (
  new Promise((resolve, reject) => {
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
    log.debug('Producing script and style bundles...');
    Promise
      .all([].concat.apply([], [
        produce.buildMarkupsForRenderers(),
        produce.buildStylesForRenderers(),
        produce.buildScriptsForRenderers(),
        produce.buildScriptForMain()
      ]))
      .then((allBundles) => {
        const eslintErrorsKeys = Object.keys(config.eslintErrors);
        if (eslintErrorsKeys.length > 0) {
          log.error('ESLint errors found: ↴\n');
          // const firstKey = eslintErrorsKeys[0];
          // console.log(config.eslintErrors[firstKey]); // Show only one error per time
          eslintErrorsKeys.forEach((key) => {
            console.log(config.eslintErrors[key]);
          });
          if (process.env.NODE_ENV === 'production') {
            return reject();
          }
        }
        allBundles.forEach(({ src, ...rest }) => {
          config.bundles[src] = rest;
        });
        return resolve();
      })
      .catch((err) => reject(err));
  })
);
