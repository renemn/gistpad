import Component from '../../_shared/utils/Component';

const getLanguageFromExtension = (extension) => {
  let filetype = null;
  switch (extension) {
    case '.js':
      filetype = 'customJS';
      break;
    case '.css':
      filetype = 'css';
      break;
    case '.html':
      filetype = 'html';
      break;
    case '.md':
      filetype = 'markdown';
      break;
    case '.json':
      filetype = 'json';
      break;
    default:
      filetype = 'plaintext';
  }
  return filetype;
};

export default class GistDocument extends Component {
  static template({ name }) {
    return (
      `<div class="gist-document">
        <header class="gist-document-head">
          <strong class="gist-document-name">${name}</strong>
        </header>
        <section class="gist-document-body">
        </section>
      </diV>`
    );
  }
  
  componentAfterInit() {
    this.$filename = this.$element.getElementsByClassName('gist-document-name`')[0];
    this.$body = this.$element.getElementsByClassName('gist-document-body')[0];
    this._addMonacoEditor();
  }

  _createModel() {
    const { extension, value, name } = this.props;
    const uri = window.monaco.Uri.parse(`file:///${name}`);
    let model = window.monaco.editor.getModel(uri);
    if (!model) {
      model = window.monaco.editor.createModel(value, getLanguageFromExtension(extension), uri);
      model.updateOptions({
        tabSize: 2,
        insertSpaces: true,
      });
    }
    return model;
  }

  _addMonacoEditor() {
    const model = this._createModel();
    this.editor = window.monaco.editor.create(this.$body, {
      theme: 'github',
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      contextmenu: false,
      lineDecorationsWidth: 20,
      lineHeight: 18,
      renderLineHighlight: 'line',
      scrollbar: { vertical: 'hidden', verticalHasArrows: false },
      model,
    });
    this.editor.onDidChangeModelContent(() => {
      this.refreshEditorLayout();
    });
  }

  refreshEditorLayout() {
    const lineHeight = this.editor.getConfiguration().lineHeight;
    const lineCount = this.editor.getModel().getLineCount();
    this.$body.style.height = `${lineHeight * lineCount}px`;
    this.editor.layout();
  }
}
