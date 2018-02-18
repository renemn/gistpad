import { ObjectModel, ArrayModel } from 'objectmodel';
import Component from '../../_shared/utils/Component';
import GistDocument from './GistDocument';

export default class GistCollection extends Component {
  static template() {
    return (
      `<div class="gist-collection"></diV>`
    );
  }

  static propTypes() {
    return {
      dirTree: ObjectModel({
        path: String,
        name: String,
        size: Number,
        type: String,
        children: ArrayModel(Object),
      }),
    };
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
