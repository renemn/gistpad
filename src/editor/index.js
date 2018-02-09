import customJS from '../_shared/utils/javascriptLang';
import githubTheme from '../_shared/utils/githubTheme';
import GistCollection from './components/GistCollection';

window.monaco.languages.register({  id: 'customJS' });
window.monaco.languages.setMonarchTokensProvider('customJS', customJS);
window.monaco.editor.defineTheme('github', githubTheme);

const gistDirTree = {
  path: 'k2je08kf53kf',
  name: 'k2je08kf53kf',
  size: 800,
  type: 'directory',
  children: [
    {
      path: 'j19d02lm4t/index.js',
      name: 'index.js',
      size: 400,
      type: 'file',
      extension: '.js',
      value: `
import Animation from '../utils/Animation';
import decorate from '../utils/decorate';
import spring from '../utils/spring';

export default decorate({

  animate(defaultStyle, style, handleUpdate, handleRest) {
    if (this._animation) {
      this._animation.stop();
    }
    this._animation = new Animation(style);
    this._animation.on('update', handleUpdate);
    this._animation.on('rest', handleRest);
    this._animation.start(defaultStyle);
  },

});`.trim(),
    },
    {
      path: 'k2je08kf5g/index.html',
      name: 'index.html',
      size: 200,
      type: 'file',
      extension: '.html',
      value: `
<!DOCTYPE html>
<html style="height:100%">
<head>
  <link data-inline="yes-please" href="./spinner.css" rel="stylesheet" />
  <style type="text/css">
    body { margin: 0; padding: 0; border: 0; }
    .monaco-editor { overflow: hidden; }
  </style>
</head>
<body>
  <div id="root">
  </div>
</body>
</html>`.trim(),
    },
    {
      path: 'l9j0mcu3v9/index.css',
      name: 'index.css',
      size: 300,
      type: 'file',
      extension: '.css',
      value: `
body {
  margin: 0;
  padding: 0;
  font-family: "Segoe UI",Arial,"HelveticaNeue-Light", sans-serif;
  font-size: 13px;
  overflow: hidden;
}

select {
  width: initial;
}

.playground-page .title {
  font-family: "Segoe UI Light","HelveticaNeue-UltraLight", sans-serif;
  font-weight: 100;
  font-size: 1.8em;
}`.trim(),
    },
  ],
};

const gistCollection = new GistCollection({
  key: `gist-collection-${gistDirTree.name}`,
  dirTree: gistDirTree,
});

gistCollection.render(document.body, 'afterbegin');
