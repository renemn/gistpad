const config = require('../config');
const log = require('../utils/log');
const compileJS = require('./compileJS');

const compileMainScripts = () => {
  const mainPath = config.paths.main.js;
  const name = 'main';
  return compileJS(mainPath).then((result) => {
    return {
      context: name,
      name: name,
      type: 'js',
      src: mainPath,
      code: result.code,
    };
  });
};

module.exports = () => (
  new Promise((resolve, reject) => {
    log.debug('Producing script and style bundles...');
    Promise
      .all([].concat.apply([], [compileMainScripts()]))
      .then((result) => {
        if (config.eslintErrors.size > 0) {
          log.error('ESLint errors found: ↴\n');
          config.eslintErrors.forEach((err) => {
            console.log(err);
          });
          if (process.env.NODE_ENV === 'production') {
            return eject();
          }
        }
        // log.debug('Bundles: ↴\n', result);
        resolve(result);
      })
      .catch((err) => reject(err));
  })
);
