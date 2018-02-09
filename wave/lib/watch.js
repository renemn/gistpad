const path = require('path');
const chalk = require('chalk');
const chokidar = require('chokidar');
const config = require('../config');
const log = require('../utils/log');

module.exports = () => (
  new Promise((resolve) => {
    const srcPath = config.paths.src;

    log(`Watching ${chalk.green(chalk.bold(srcPath))} for changes...`);

    const srcGlob = path.join(srcPath, '**/*.(js|json|html|css)');    
    const watcher = chokidar.watch(srcGlob, {
      ignoreInitial: true,
    });

    watcher.on('change', (filepath) => {
      log.debug(`Source changed: ${filepath}`);
    });

    config.watcher = watcher;

    resolve();
  })
);