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

module.exports = (src) => (
  new Promise((resolve, reject) => {
    log.debug(`Compiling "${src}"...`);

    const isProduction = process.env.NODE_ENV === 'production';
    const { paths, cache } = config;

    const rollupConfig = {
      entry: src,
      // cache: cache[src] || null,
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

    rollup(rollupConfig)
      .then((bundle) => {
        // cache[src] = bundle;
        resolve(bundle.generate({
          format: 'cjs',
          moduleName: src,
          sourceMap: 'inline',
        }));
      })
      .catch((err) => {
        log.error(`${capitalizeFirstLetter(err.plugin)} problem found. ↴\n`);
        if (err.plugin && err.plugin === 'buble') {
          formatBubleErrors(err);
        }
        reject();
      });
  })
);