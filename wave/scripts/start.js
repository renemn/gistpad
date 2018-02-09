process.env.NODE_ENV = 'development';

const options = require('minimist')(process.argv.slice(2));
const chalk = require('chalk');
const config = require('../config');
const log = require('../utils/log');
const lifespan = require('../utils/lifespan');
const produce = require('../lib/produce');
const launch = require('../lib/launch');
const watch = require('../lib/watch');

log.debugging = Boolean(options.debug);

const clearScreen = (displayName, version) => {
  log.clear();
  log.sign(displayName, version, { font: 'Big' });
};

const stopEvents = () => {
  if (config.watcher) {
    config.watcher.unwatch();
    config.watcher.close();
  }
  config.events.removeAllListeners();
};

const stopScript = () => {
  log.debug('Config: ↴\n', config);
  stopEvents();
  lifespan.finish();
};

// Need an async function to use 'await', a self-invoked function does the job
(async (opts) => {
  try {
    lifespan.start();

    process.on('unhandledRejection', lifespan.fail('Unhandled error thrown.'));
    ['SIGINT', 'SIGTERM'].forEach((sig) => { process.on(sig, stopScript); });

    // Setup configuration asynchronously and fail if errors are found
    const { package: { displayName, version }, events } = await config.setup(opts)
      .catch(lifespan.fail('Error while setting up configuration.'));
    
    events.on('clear', () => { clearScreen(displayName, version); });
    events.on('stop', () => { stopScript(); });

    clearScreen(displayName, version);

    // Produce initial JS and CSS bundles for main and renderers
    await produce.all()
      .catch(lifespan.fail('Error while producing initial bundles.'));

    clearScreen(displayName, version);

    // Watch for files that change and hot reload according
    const srcPath = await watch()
      .catch(lifespan.fail('Something went wrong while watching src files.'));
  
    // Launch the electron app using bundles from build
    await launch()
      .catch(lifespan.fail('Error while opening the electron app.'));
    
    log(`${displayName} desktop application running...`);
    log(`Watching ${chalk.green(chalk.bold(srcPath))} for changes...`);
    
    // stopScript();

  } catch (err) {
    stopEvents();
    if (err && err.message) return Promise.reject(err.message);
    process.exit(1);
  }
})({ cwd: process.cwd(), ...options })
  .catch(lifespan.fail('Something went wrong during start execution.'));
