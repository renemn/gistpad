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
  ],
};

const gistCollection = new GistCollection({
  key: `gist-collection-${gistDirTree.name}`,
  dirTree: gistDirTree,
});

gistCollection.render(document.body, 'afterbegin');
