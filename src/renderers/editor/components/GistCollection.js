const Component = require('../../_shared/utils/Component');
const GistDocument = require('./GistDocument');

module.exports = class GistCollection extends Component {
  static template() {
    return (
      `<div class="gist-collection"></diV>`
    );
  }

  componentAfterInit() {
    this._addGistDocuments();
  }

  _addGistDocuments() {
    const { dirTree } = this.props;
    const fragment = document.createDocumentFragment();
    dirTree.children.forEach(({ name: filename }, i) => {
      this.addChild(new GistDocument({
        key: `gist-document-${i}`,
        filename,
      }).render(fragment));
    });
    this.$element.appendChild(fragment);
  }
}
