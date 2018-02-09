const { spawn } = require('child_process');
const electron = require('electron');
const config = require('../config');
const log = require('../utils/log');

module.exports = () => (
  new Promise((resolve, reject) => {
    log(`Launching ${config.package.displayName} desktop application...`);

    const { paths } = config;
    const src = paths.main.root.replace(paths.src, paths.build);
    const proc = spawn(electron, [src]);

    proc.stdout.on('data', (data) => {
      log.debug(data.toString());
    });

    proc.stderr.on('data', (data) => {
      const str = data.toString();
      if (!str.includes(`Couldn't set selectedTextBackgroundColor from default ()`)) {
        log.error(str);
      }
    });

    proc.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(`Exited with code ${code}.`));
      }
      resolve();
    });

    proc.on('exit', () => {
      resolve();
    });

    config.electron = proc;
  })
);
