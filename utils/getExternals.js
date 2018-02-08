const fs = require('fs-extra');
const config = require('../config');

const nodeModules = [
  'assert', 'buffer', 'child_process', 'cluster', 'console', 'constants',
  'crypto', 'dgram', 'dns', 'domain', 'events', 'fs', 'http', 'https',
  'module', 'net', 'os', 'path', 'process', 'punycode', 'querystring',
  'readline', 'repl', 'stream', 'string_decoder', 'timers', 'tls', 'tty',
  'url', 'util', 'v8', 'vm', 'zlib'
];

const electronModules = ['electron'];

module.exports = () => {
  const pkg = JSON.parse(fs.readFileSync(config.paths.package, 'utf-8'));
  return [].concat.apply([], [
    nodeModules,
    electronModules,
    Object.keys(pkg.dependencies)
  ]);
};
