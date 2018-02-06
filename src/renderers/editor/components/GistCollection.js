const loadMonaco = require('../../_shared/utils/loadMonaco');
const customJS = require('../../_shared/utils/javascriptLang');
const githubTheme = require('../../_shared/utils/githubTheme');
const Component = require('../../_shared/utils/Component');
const GistDocument = require('./GistDocument');

module.exports = class GistCollection extends Component {
  static template() {
    return (
      `<div class="gist-collection"></diV>`
    );
  }

  componentAfterInit() {
    this._createEditor();
  }

  _createEditor() {
    const self = this;
    if (!window.monaco) {
      loadMonaco().then(() => {
        window.monaco.languages.register({  id: 'customJS' });
        window.monaco.languages.setMonarchTokensProvider('customJS', customJS);
        window.monaco.editor.defineTheme('github', githubTheme);
        self._addGistDocuments();
      });
    }
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
