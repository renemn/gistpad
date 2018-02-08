const fs = require('fs-extra');
const config = require('../config');
const log = require('../utils/log');

module.exports = () => (
  new Promise((resolve, reject) => {
    log.debug('Preparing output directory before producing...');
    
    const { src, build, assets: srcAssets } = config.paths;
    const buildAssets = srcAssets.replace(src, build);
    
    Promise.resolve()
      .then(() => fs.ensureDir(build))
      .then(() => fs.emptyDir(build))
      .then(() => fs.copy(srcAssets, buildAssets))
      .then(() => resolve())
      .catch((e) => reject(e));
  })
);
