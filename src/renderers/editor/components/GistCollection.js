const Component = require('../../_shared/utils/Component');
const GistDocument = require('./GistDocument');

module.exports = class GistCollection extends Component {
  static template() {
    return (
      `<div class="gist-collection"></diV>`
    );
  }

  componentAfterRender() {
    this._addGistDocuments();
  }

  _addGistDocuments() {
    const { dirTree } = this.props;
    const self = this;
    dirTree.children.forEach((dirFile, i) => {
      const child = self.addChild(new GistDocument(Object.assign({}, {
        key: `gist-document-${i}`,
      }, dirFile)));
      child
        .render(this.$element)
        .refreshEditorLayout();
    });
  }
}
