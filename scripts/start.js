process.env.NODE_ENV = 'development';

const options = require('minimist')(process.argv.slice(2));
const config = require('../config');
const log = require('../utils/log');
const lifespan = require('../utils/lifespan');
const prepare = require('../lib/prepare');
const produce = require('../lib/produce');
const serve = require('../lib/serve');
const launch = require('../lib/launch');
const { displayName, version } = require('../package.json');

lifespan.start();
process.on('unhandledRejection', lifespan.fail('Unhandled error thrown.'));

log.debugging = Boolean(options.debug);
log.clear();
log.sign(displayName, version, { font: 'Big' });

// Need an async function to use 'await', a self-invoked function does the job
(async (opts) => {
  try {
    // 1. Setup configuration asynchronously and fail if errors are found
    await config.setup(opts)
      .catch(lifespan.fail('Error while setting up configuration.'));
    
    // 2. Prepare and clean the build folder before producing
    await prepare()
      .catch(lifespan.fail('Error while preparing the "build" folder.'));

    // 3. Produce initial JS and CSS bundles for main and renderers
    await produce.all()
      .catch(lifespan.fail('Error while producing initial bundles.'));
    
    // 4. Serve bundles and assets from build folder
    await serve()
      .catch(lifespan.fail('Error during server initialization.'));
    
    // 5. Launch the electron app using bundles from build
    await launch()
      .catch(lifespan.fail('Error while opening the electron app.'));
    
    // 6. Stop all processes running when signals below get listened
    ['SIGINT', 'SIGTERM'].forEach((sig) => {
      process.on(sig, () => {
        lifespan.finish();
      });
    });

    // 7. Log the whole configuration, only on debug mode on
    log.debug('Config: ↴\n', config);
  } catch (err) {
    if (err && err.message) {
      return Promise.reject(err.message);
    }
    process.exit(1);
  }
})({ cwd: process.cwd(), ...options })
  .catch(lifespan.fail('Something went wrong during start execution.'));
