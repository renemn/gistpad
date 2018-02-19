const path = require('path');
const url = require('url');
const chalk = require('chalk');
const chokidar = require('chokidar');
const WebSocket = require('ws');
const config = require('../config');
const log = require('../utils/log');
const produce = require('./produce');

module.exports = () => (
  new Promise((resolve) => {
    const srcPath = config.paths.src;
    const srcGlob = path.join(srcPath, '**/*.(js|json|html|css)');    

    const wss = new WebSocket.Server({ port: config.port });
    const clients = {};
    let renderersNames = [];

    const emitAction = (action, data = null) => {
      renderersNames
        .filter(name => clients.hasOwnProperty(name))
        .forEach(name => clients[name].send(JSON.stringify({ action, data })));
      renderersNames = [];
      renderersNames.length = 0;
    };

    const watcher = chokidar.watch(srcGlob, {
      ignoreInitial: true,
    });

    config.events.on('error', (msg) => {
      emitAction('overlay', msg);
    });

    wss.on('connection', (wsc, req) => {
      const { query: { id } } = url.parse(req.url, true);
      clients[id] = wsc;
      wsc.on('message', (msg) => {
        log.debug(msg);
      });
      wsc.on('close', () => {
        clients[id] = null;
      });
    });

    watcher.on('change', filepath => {
      log.debug(`Source changed: ${filepath}`);

      Object.keys(config.bundles)
        .filter(bundle => {
          const { dependencies, context } = config.bundles[bundle];
          return dependencies && dependencies.includes(filepath) && context === 'renderer';
        })
        .forEach((bundle) => renderersNames.push(config.bundles[bundle].name));

      if (renderersNames.length <= 0) return;

      log.debug(`Refreshing renderers: ${chalk.bold(renderersNames.join(', '))}`);
      config.events.emit('clear');
      switch (path.extname(filepath)) {
        case '.js':
          produce.buildScriptsForRenderers(renderersNames).then(() => {
            emitAction('reload');
          });
          break;
        case '.css':
          produce.buildStylesForRenderers(renderersNames).then(() => {
            emitAction('repaint');
          });
          break;
        case '.html':
          produce.buildMarkupsForRenderers(renderersNames).then(() => {
            log.debug('>>> Bundles:', config.bundles); // eslint-disable-line
          });
          break;
      }
    });

    config.wss = wss;
    config.watcher = watcher;
    resolve(srcPath);
  })
);