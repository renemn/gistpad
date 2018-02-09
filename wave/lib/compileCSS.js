const fs = require('fs-extra');
const postcss = require('postcss');
const csso = require('postcss-csso');
const cssnext = require('postcss-cssnext');
const cssimport = require('postcss-import');
const log = require('../utils/log');

module.exports = (src) => (
  new Promise((resolve, reject) => {
    log.debug(`Compiling "${src}"...`);

    const isProduction = process.env.NODE_ENV === 'production';
    const processor = postcss();
    const options = {
      from: src,
    };

    processor
      .use(cssimport())
      .use(cssnext({
        browsers: 'last 8 versions',
      }));
    
    if (isProduction) {
      processor.use(csso);
    }

    Promise.resolve()
      .then(() => fs.readFile(src, 'utf-8'))
      .then(content => processor.process(content, options))
      .then(result => resolve(result))
      .catch(err => reject(err));
  })
);