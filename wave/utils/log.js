const chalk = require('chalk');
const figlet = require('figlet');

const pad = (str, size) => {
  let s = String(str);
  while (s.length < size) {
    s = `0${s}`;
  }
  return s;
};

const addTime = (args) => {
  const now = new Date();
  const h = pad(now.getHours(), 2);
  const m = pad(now.getMinutes(), 2);
  const s = pad(now.getSeconds(), 2);
  const ms = pad(now.getMilliseconds(), 3);
  const stamp = chalk.hex('#888e8e')(`${h}:${m}:${s}:${ms}`);
  Array.prototype.unshift.call(args, stamp);
};

const log = (...args) => {
  addTime(args);
  console.log.apply(console, args); // eslint-disable-line
};

log.error = (...args) => {
  if (!args) {
    return;
  }
  Array.prototype.unshift.call(args, chalk.red(`[Error]`));
  addTime(args);
  console.log.apply(console, args); // eslint-disable-line
};

log.debug = (...args) => {
  if (log.debugging) {
    Array.prototype.unshift.call(args, chalk.yellow('[Debug]'));
    log.apply(null, args);
  }
};

log.success = (...args) => {
  Array.prototype.unshift.call(args, chalk.green('[Success]'));
  log.apply(null, args);
  console.log(); // eslint-disable-line
};

log.clear = () => {
  process.stdout.write(
    process.platform === 'win32' ? '\x1Bc' : '\x1B[2J\x1B[3J\x1B[H'
  );
};

log.sign = (txt = '', version = '', options = {}) => {
  const signature = figlet.textSync(txt, options);
  const v = chalk.cyan(`v${version}`);
  console.log(`${signature.replace(/((\s*\S+)*)\s*/, "$1")} ${v}\n`); // eslint-disable-line
};

log.console = console;

module.exports = log;
