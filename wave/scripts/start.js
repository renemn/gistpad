process.env.NODE_ENV = 'development';

const options = require('minimist')(process.argv.slice(2));
const config = require('../config');
const log = require('../utils/log');
const lifespan = require('../utils/lifespan');
const produce = require('../lib/produce');
const launch = require('../lib/launch');

log.debugging = Boolean(options.debug);

const stopScript = () => {
  log.debug('Config: ↴\n', config);
  lifespan.finish();
};

// Need an async function to use 'await', a self-invoked function does the job
(async (opts) => {
  try {
    lifespan.start();
    
    process.on('unhandledRejection', lifespan.fail('Unhandled error thrown.'));
    ['SIGINT', 'SIGTERM'].forEach((sig) => { process.on(sig, stopScript); });

    // Setup configuration asynchronously and fail if errors are found
    const { package: { displayName, version } } = await config.setup(opts)
      .catch(lifespan.fail('Error while setting up configuration.'));

    log.clear();
    log.sign(displayName, version, { font: 'Big' });

    // Produce initial JS and CSS bundles for main and renderers
    await produce.all()
      .catch(lifespan.fail('Error while producing initial bundles.'));
    
    // Launch the electron app using bundles from build
    await launch()
      .catch(lifespan.fail('Error while opening the electron app.'));

    stopScript();
  } catch (err) {
    if (err && err.message) return Promise.reject(err.message);
    process.exit(1);
  }
})({ cwd: process.cwd(), ...options })
  .catch(lifespan.fail('Something went wrong during start execution.'));
