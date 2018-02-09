const chalk = require('chalk');
const codeFrame = require('babel-code-frame');

module.exports = (results) => {
  const frameOptions = {
    highlightCode: true
  };
  let output = null;
  let errorCount = 0;
  let warningCount = 0;
  let sum = 0;

  if (results.length === 0) {
    return;
  }

  const filesOutput = results.map(result => {
    if (!result.messages || !result.messages.length) result;
    const fileContent = result.source;
    const filename = chalk.underline(result.filePath);

    const messagesOutput = result.messages.map((message) => {
      let symbol;
      const ruleId = chalk.dim(`${message.ruleId}`);
      const { line, column } = message;

      if (message.severity === 1) {
        symbol = chalk.yellow('Warning');
        warningCount += 1;
      } else if (message.severity === 2) {
        symbol = chalk.red('Error');
        errorCount += 1;
      }

      return [
        `${symbol} ${message.message} (${line}:${column}) ${ruleId}`,
        `${codeFrame(fileContent, line, column, frameOptions)}`
      ].join('\n');
    });

    return `${filename}\n\n${messagesOutput.join('\n\n')}`;
  });

  output = `${filesOutput.filter(s => s).join('\n\n\n')}\n\n`;
  sum = errorCount + warningCount;
  output += `${`${sum} problems (${errorCount} errors, ${warningCount} warnings)`}\n`;
  return output;
};
