const Component = require('../../_shared/utils/Component');
const loadMonaco = require('../../_shared/utils/loadMonaco');
const customJS = require('../../_shared/utils/javascriptLang');
const githubTheme = require('../../_shared/utils/githubTheme');

module.exports = class GistFile extends Component {
  static template({ filename }) {
    return (
      `<div class="gist-file">
        <header class="gist-file-head">
          <span class="gist-file-name">${filename}</span>
        </header>
        <section class="gist-file-body">
        </section>
      </diV>`
    );
  }
  
  componentAfterInit() {
    this.$filename = this.$element.getElementsByClassName('gist-file-name`')[0];
    this.$body = this.$element.getElementsByClassName('gist-file-body')[0];
    this._addMonacoEditor();
  }

  async _addMonacoEditor() {
    this.monaco = await loadMonaco();
    this.monaco.languages.register({ id: 'customJS' });
    this.monaco.languages.setMonarchTokensProvider('customJS', customJS);
    this.monaco.editor.defineTheme('github', githubTheme);
    this.editor = this.monaco.editor.create(this.$body, {
      language: 'customJS',
      theme: 'github',
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      value: '// Javascript code here...',
      contextmenu: false,
      lineDecorationsWidth: 20,
      lineHeight: 18,
      renderLineHighlight: 'line',
      scrollbar: {
        vertical: 'hidden',
        verticalHasArrows: false,
      },
    });
    this.editor.onDidChangeModelContent(e => {
      this.refreshEditorLayout();
    });
    this.refreshEditorLayout();
  }

  refreshEditorLayout() {
    const separation = 20;
    const lineHeight = this.editor.getConfiguration().lineHeight;
    const lineCount = this.editor.getModel().getLineCount();
    this.$body.style.height = `${(lineHeight * lineCount) + separation}px`;
    this.editor.layout();
  }
}
