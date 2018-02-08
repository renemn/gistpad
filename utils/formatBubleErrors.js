const chalk = require('chalk');
const fs = require('fs-extra');
const codeFrame = require('babel-code-frame');

module.exports = (err) => {
  if (!err) {
    return;
  }

  const frameOptions = { highlightCode: true };
  const fileContent = fs.readFileSync(err.id, 'utf-8');
  const { line, column } = err.loc;
  const output = [
    `${chalk.red('Error')} Unexpected token (${line}:${column})`,
    codeFrame(fileContent, line, column, frameOptions)
  ].join('\n');

  return `${chalk.underline(err.id)}\n\n${output}\n`;
};
