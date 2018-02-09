const path = require('path');
const chalk = require('chalk');
const chokidar = require('chokidar');
const config = require('../config');
const log = require('../utils/log');

module.exports = () => (
  new Promise((resolve) => {
    const srcPath = config.paths.src;
    const srcGlob = path.join(srcPath, '**/*.(js|json|html|css)');    
    const watcher = chokidar.watch(srcGlob, {
      ignoreInitial: true,
    });

    watcher.on('change', (filepath) => {
      log(`Source changed: ${filepath}`);
      const renderers = [];
      Object.keys(config.bundles).forEach((bundle) => {
        const { dependencies, context, name } = config.bundles[bundle];
        if (dependencies && dependencies.includes(filepath) && context === 'renderer') {
          renderers.push(name);
        }
      });
      if (renderers.length <= 0) return;
      log(`Refreshing renderers: ${chalk.bold(renderers.join(', '))}`);
      // config.events.emit('clear');
    });

    config.watcher = watcher;
    resolve(srcPath);
  })
);