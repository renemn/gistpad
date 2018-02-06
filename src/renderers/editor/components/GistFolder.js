const Component = require('../../_shared/utils/Component');
const GistFile = require('./GistFile');

module.exports = class GistFolder extends Component {
  componentAfterInit() {
    this._addGistFiles();
  }

  _addGistFiles() {
    const { dirTree } = this.props;
    const fragment = document.createDocumentFragment();
    dirTree.children.forEach(({ name: filename }, i) => {
      this.addChild(new GistFile({
        key: `filename-${i}`,
        filename: filename,
      }).render(fragment));
    });
    this.$element.appendChild(fragment);
  }
}
