const GistFolder = require('./components/GistFolder');

const gistFolder = new GistFolder({
  key: 'gist',
  className: 'gist',
  dirTree: {
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
        extension: '.html'
      },
      {
        path: 'l9j0mcu3v9/index.css',
        name: 'index.css',
        size: 300,
        type: 'file',
        extension: '.css'
      },
      {
        path: 'j19d02lm4t/index.js',
        name: 'index.js',
        size: 400,
        type: 'file',
        extension: '.js'
      },
    ],
  },
});

gistFolder.render(document.body, 'afterbegin');
