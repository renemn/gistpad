const path = require('path');

module.exports = (options = {}) => {
  return new Promise((resolve, reject) => {
    const monacoDir = path.join(process.cwd(), 'node_modules/monaco-editor');
    const loader = require(path.join(monacoDir, 'min/vs/loader.js'));
  
    if (!loader) {
      return reject(`Found monaco-editor in ${monacoDir}, but failed to require!`);
    }
  
    options.baseUrl = options.baseUrl || `file:///${monacoDir}/min`;
  
    loader.require.config({
      baseUrl: options.baseUrl,
    });
  
    self.module = undefined;
    self.process.browser = true;

    loader.require(['vs/editor/editor.main'], () => {
      if (monaco) {
        resolve(monaco);
      } else {
        reject('Monaco loaded, but could not find global "monaco"');
      }
    });
  });
};
