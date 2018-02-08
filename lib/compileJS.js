const { rollup } = require('rollup');
const buble = require('rollup-plugin-buble');
const commonjs = require('rollup-plugin-commonjs');
const eslint = require('rollup-plugin-eslint');
const json = require('rollup-plugin-json');
const nodeResolve = require('rollup-plugin-node-resolve');
const replace = require('rollup-plugin-replace');
const uglify = require('rollup-plugin-uglify');

const config = require('../config');
const log = require('../utils/log');
const { filterFalsies, capitalizeFirstLetter } = require('../utils/commons');
const getExternals = require('../utils/getExternals');
const formatBubleErrors = require('../utils/formatBubleErrors');
const fromatESLintErros = require('../utils/formatESLintErrors');

module.exports = (src, cache = null) => (
  new Promise((resolve, reject) => {
    log.debug(`Compiling "${src}"...`);

    const isProduction = process.env.NODE_ENV === 'production';
    const { paths } = config;
    let bundleCache = null;

    const rollupConfig = {
      entry: src,
      cache,
      plugins: filterFalsies([
        json(),
        eslint({
          configFile: paths.eslintrc,
          exclude: [`${paths.nodeModules}/**`],
          include: [`${paths.src}/**`],
          useEslintrc: false,
          formatter: (results) => {
            const output = fromatESLintErros(results);
            if (output) {
              config.eslintErrors.add(output);
            }
          }
        }),
        buble({
          exclude: [`${paths.nodeModules}/**`],
        }),
        nodeResolve({
          extensions: ['.js'],
        }),
        replace({
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        }),
        commonjs({
          include: [`${paths.nodeModules}/**`],
        }),
        isProduction ? uglify() : null,
      ]),
      external: getExternals(config.paths.package),
      onwarn() {},
    };

    return rollup(rollupConfig)
      .then((bundle) => {
        bundleCache = bundle;
        return bundle.generate({ format: 'cjs', sourcemap: 'inline' });
      })
      .then((result) => {
        return resolve([result, bundleCache]);
      })
      .catch((err) => {
        if (err.plugin) {
          log.error(
            `${capitalizeFirstLetter(err.plugin)} problem found. ↴\n`,
            err.plugin && err.plugin === 'buble' ? formatBubleErrors(err) : err
          );
          return reject();
        } else {
          return reject(err);
        }
      });
  })
);