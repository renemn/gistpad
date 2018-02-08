const http = require('http');
const url = require('url');
const path = require('path');
const chalk = require('chalk');
const serveStatic = require('serve-static');
const finalhandler = require('finalhandler');
const config = require('../config');
const log = require('../utils/log');

const handleJS = (uri, res) => {
  if (path.extname(uri) !== '.js') return false;
  const src = path.resolve(config.paths.renderers.root, uri);
  const code = config.bundles[src].code;
  res.setHeader('Content-Type', 'text/javascript');
  res.end(code);
  if (!code) return false;
};

module.exports = () => (
  new Promise((resolve, reject) => {
    log.debug('Starting development server...');
    const { watcher } = config;
    
    const serve = serveStatic(watcher.glob, {
      etag: false,
      index: false,
    });

    const server = http.createServer((req, res) => {
      const uri = url.parse(req.url).pathname.replace(/^\/|$/g, '');
      if (handleJS(uri, res)) {
        log.debug(`${chalk.green(req.method)} ${req.url}`);
        return;
      }
      log.debug(`${chalk.red(req.method)} ${req.url}`);
      serve(req, res, finalhandler(req, res));
    });

    server.on('error', reject);
    server.on('listening', resolve);
    server.listen(config.port);
    
    config.server = server;
  })
);