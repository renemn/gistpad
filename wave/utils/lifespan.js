const chalk = require('chalk');
const log = require('./log');

const lifespan = module.exports;

let hr = process.hrtime();

const timing = (hrend) => (
  `${hrend[0]}s with ${(hrend[1] / 1000000).toFixed(3)}ms`
);

lifespan.start = () => {
  hr = process.hrtime();
  return;
};

lifespan.finish = () => {
  log(`Process finished in ${timing(process.hrtime(hr))}`);
  if (process.env.NODE_ENV === 'production') {
    log(chalk.green('SUCCESS!'));
  } else {
    log(chalk.bold('Application stopped.'));
  }
  process.exit(0);
};

lifespan.fail = (msg) => (e) => {
  log(`Process finished in ${timing(process.hrtime(hr))}`);
  if (msg) log.error(msg);
  if (e && e.stack) {
    const str = e.stack.split('\n');
    log(chalk.bold(str.shift()));
    console.log(str.join('\n'));
  }
  log.error('FAILED!');
  console.log();
  process.exit(1);
};
