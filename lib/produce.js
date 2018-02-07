const config = require('../config');

module.exports = () => (
  new Promise((resolve, reject) => {
    const mainPath = config.paths.main;
    
    log.debug('Producing script and style bundles...');
  })
);
