const fs = require('fs-extra');
const path = require('path');
const config = require('../config');
const log = require('../utils/log');
const compileJS = require('./compileJS');
const compileCSS = require('./compileCSS');

const produce = module.exports;

const pws = fs.readFileSync(require.resolve('pws/index.js', 'utf-8'));

const replaceSrc = (src) => (
  src.replace(config.paths.src, config.paths.build)
);

const resolvePaths = (directory, dependencies) => {
  const result = dependencies.map((dependency) => (
    path.resolve(directory, dependency)
  ));
  return result;
};

const socketTag = (renderer) => (`\n
  <script id="wave-socket">
    const WebSocket = require('ws');
    ${pws}
    (() => {
      const el = document.getElementById('wave-socket');
      if (el) el.parentNode.removeChild(el);
      const url = 'ws://localhost:${config.port}/wave/?id=${renderer}';
      const protocols = { pingTimeout: 0, maxReconnectDelay: 1000 * 10 };
      const ws = new PersistentWebSocket(url, protocols, WebSocket);
      ws.onopen = () => {
        ws.send('Connection established with ${renderer} renderer');
      };
      ws.onmessage = ({ data }) => {
        const { action } = JSON.parse(data);
        switch (action) {
          case 'reload':
            window.location.reload();
            break;
          case 'repaint':
            const styles = document.querySelectorAll('link[rel=stylesheet]');
            styles.forEach((style) => {
              const href = style.getAttribute('href');
              const newHref = href + (href.indexOf('?') >= 0 ? '&' : '?') + '_wave_nocache=' + (new Date()).getTime();
              style.setAttribute('href', newHref);
            });
            break;
        }
      };
    })();
  </script>`
);

produce.buildScriptForMain = (name = 'main') => (
  new Promise((resolve) => {
    const src = config.paths.main.js;
    const target = replaceSrc(src);
    fs.ensureFile(target)
      .then(() => compileJS(src))
      .then(({ code, cache, map }) => {
        const dependencies = resolvePaths(path.dirname(src), map.sources);
        config.bundles[src] = { context: name, name, type: 'js', src, target, dependencies, code, cache };
        return fs.writeFile(target, code);
      })
      .then(() => resolve());
  })
);

produce.buildScriptForRenderer = (name) => (
  new Promise((resolve) => {
    const src = config.paths.renderers[name].js;
    const target = replaceSrc(src);
    fs.ensureFile(target)
      .then(() => compileJS(src))
      .then(({ code, cache, map }) => {
        const context = 'renderer';
        const dependencies = resolvePaths(path.dirname(src), map.sources);
        config.bundles[src] = { context, name, type: 'js', src, target, dependencies, code, cache };
        return fs.writeFile(target, code);
      })
      .then(() => resolve());
  })
);

produce.buildStyleForRenderer = (name) => (
  new Promise((resolve) => {
    const src = config.paths.renderers[name].css;
    const target = replaceSrc(src);
    fs.ensureFile(target)
      .then(() => compileCSS(src))
      .then(({ css: code, messages }) => {
        const context = 'renderer';
        const dependencies = [];
        messages.forEach(({ type, file }) => { if (type === 'dependency') dependencies.push(file); });
        dependencies.push(src);
        config.bundles[src] = { context, name, type: 'css', src, target, dependencies, code, cache: null };
        return fs.writeFile(target, code);
      })
      .then(() => resolve());
  })
);

produce.buildMarkupForRenderer = (name) => (
  new Promise((resolve) => {
    const src = config.paths.renderers[name].html;
    const target = replaceSrc(src);
    fs.copy(src, target)
      .then(() => {
        if (process.env.NODE_ENV === 'development') {
          return Promise.resolve()
            .then(() => fs.readFile(target, 'utf-8'))
            .then((content) => {
              return content.replace('</body>', `${socketTag(name)}\n</body>`);
            })
            .then((result) => fs.writeFile(target, result));
        }
        return Promise.resolve();
      })
      .then(() => {
        config.bundles[src] = {
          context: 'renderer', name, type: 'html', src, target, dependencies: null, code: null, cache: null
        };
        return resolve();
      });
  })
);

produce.buildScriptsForRenderers = (names) => (
  Promise.all(names.map(produce.buildScriptForRenderer))
);

produce.buildStylesForRenderers = (names) => (
  Promise.all(names.map(produce.buildStyleForRenderer))
);

produce.buildMarkupsForRenderers = (names) => (
  Promise.all(names.map(produce.buildMarkupForRenderer))
);

produce.all = () => (
  new Promise((resolve, reject) => {
    log('Producing bundles for scripts and styles...');

    const { build: buildSrc } = config.paths;
    const names = config.renderers;
    Promise.resolve()
      .then(() => fs.ensureDir(buildSrc))
      .then(() => fs.emptyDir(buildSrc))
      .then(() => Promise.all([].concat.apply([], [
        produce.buildMarkupsForRenderers(names),
        produce.buildStylesForRenderers(names),
        produce.buildScriptsForRenderers(names),
        produce.buildScriptForMain()
      ])))
      .then(() => {
      // .then((allBundles) => {
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
        // allBundles.forEach(({ src, ...rest }) => {
        //   config.bundles[src] = rest;
        // });
        resolve();
      })
      .catch((err) => reject(err));
  })
);
