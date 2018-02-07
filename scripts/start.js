process.env.NODE_ENV = 'development';

const options = require('minimist')(process.argv.slice(2));
const config = require('../config');
const log = require('../lib/log');
const lifespan = require('../lib/lifespan');
const prepare = require('../lib/prepare');
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
    await prepare();
    
    // ['SIGINT', 'SIGTERM'].forEach((sig) => {
    //   process.on(sig, () => {
    //     lifespan.finish();
    //   });
    // });

    // console.log(JSON.stringify(config, null, 2));
    log.debug('Config: ↴\n', JSON.stringify(config, null, 2));
    lifespan.finish();
  } catch (err) {
    if (err && err.message) {
      return Promise.reject(err.message);
    }
    process.exit(1);
  }
})({ cwd: process.cwd(), ...options })
  .catch(lifespan.fail('Something went wrong during start execution.'));
