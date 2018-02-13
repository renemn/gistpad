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

    const watcher = chokidar.watch(srcGlob, {
      ignoreInitial: true,
    });

    watcher.on('change', (filepath) => {
      log.debug(`Source changed: ${filepath}`);
      const renderersNames = [];
      Object.keys(config.bundles).forEach((bundle) => {
        const { dependencies, context, name } = config.bundles[bundle];
        if (dependencies && dependencies.includes(filepath) && context === 'renderer') {
          renderersNames.push(name);
        }
      });
      if (renderersNames.length <= 0) return;
      log.debug(`Refreshing renderers: ${chalk.bold(renderersNames.join(', '))}`);
      // config.events.emit('clear');
      switch (path.extname(filepath)) {
        case '.js':
          produce.buildScriptsForRenderers(renderersNames).then(() => {
            renderersNames.forEach(name => {
              if (clients[name]) {
                clients[name].send(JSON.stringify({ action: 'reload' }));
              } else {
                log(`Client with name "${name}" does not exist.`);
              }
            });
          });
          break;
        case '.css':
          produce.buildStylesForRenderers(renderersNames).then(() => {
            log.debug('>>> Bundles:', config.bundles); // eslint-disable-line
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