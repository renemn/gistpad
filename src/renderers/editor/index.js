// const loadMonaco = require('../_shared/utils/loadMonaco');
// const customJS = require('../_shared/utils/javascriptLang');
// const githubTheme = require('../_shared/utils/githubTheme');
// const GistCollection = require('./components/GistCollection');

// (async () => {
//   await loadMonaco();
//   monaco.languages.register({ id: 'customJS' });
//   monaco.languages.setMonarchTokensProvider('customJS', customJS);
//   monaco.editor.defineTheme('github', githubTheme);

//   const gistDirTree = {
//     path: 'k2je08kf53kf',
//     name: 'k2je08kf53kf',
//     size: 800,
//     type: 'directory',
//     children: [
//       {
//         path: 'k2je08kf5g/index.html',
//         name: 'index.html',
//         size: 200,
//         type: 'file',
//         extension: '.html',
//         value: '<!-- HTML here! -->',
//       },
//       {
//         path: 'l9j0mcu3v9/index.css',
//         name: 'index.css',
//         size: 300,
//         type: 'file',
//         extension: '.css',
//         value: '/* CSS here! */',
//       },
//       {
//         path: 'j19d02lm4t/index.js',
//         name: 'index.js',
//         size: 400,
//         type: 'file',
//         extension: '.js',
//         value: '// JS here!',
//       },
//     ],
//   };
  
//   const gistCollection = new GistCollection({
//     key: `gist-collection-${gistDirTree.name}`,
//     dirTree: gistDirTree,
//   });
  
//   gistCollection.render(document.body, 'afterbegin');  
// })();

const GistCollection = require('./components/GistCollection');

const gistDirTree = {
  path: 'k2je08kf53kf',
  name: 'k2je08kf53kf',
  size: 800,
  type: 'directory',
  children: [
    {
      path: 'k2je08kf5g/index.html',
      name: 'index.html',
      size: 200,
      type: 'file',
      extension: '.html',
      value: '<!-- HTML here! -->',
    },
    {
      path: 'l9j0mcu3v9/index.css',
      name: 'index.css',
      size: 300,
      type: 'file',
      extension: '.css',
      value: '/* CSS here! */',
    },
    {
      path: 'j19d02lm4t/index.js',
      name: 'index.js',
      size: 400,
      type: 'file',
      extension: '.js',
      value: '// JS here!',
    },
  ],
};

const gistCollection = new GistCollection({
  key: `gist-collection-${gistDirTree.name}`,
  dirTree: gistDirTree,
});

gistCollection.render(document.body, 'afterbegin');
