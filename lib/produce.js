const config = require('../config');
const log = require('../utils/log');
const compileJS = require('./compileJS');

const compileMainScripts = () => {
  const mainPath = config.paths.main.js;
  return compileJS(mainPath).then(({ code, cache }) => ({
    context: 'main', name: 'main', type: 'js', src: mainPath, code, cache
  }));
};

module.exports = () => (
  new Promise((resolve, reject) => {
    log.debug('Producing script and style bundles...');
    Promise
      .all([].concat.apply([], [compileMainScripts()]))
      .then((allBundles) => {
        const eslintErrorsKeys = Object.keys(config.eslintErrors);
        if (eslintErrorsKeys.length > 0) {
          log.error('ESLint errors found: ↴\n');
          const firstKey = eslintErrorsKeys[0];
          console.log(config.eslintErrors[firstKey]); // Show only one error per time
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
