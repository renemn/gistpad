module.exports = class Component {
  static template() {
    return `<div></div>`;
  }

  constructor(props = {}) {
    if (!props.key) {
      throw new Error(`All components need a 'key' property.`);
    }
    let $tmp = document.createElement('div');
    this.children = new Map();
    this.parent = null;
    this.props = Object.assign({}, props);
    $tmp.insertAdjacentHTML('afterbegin', this.constructor.template(this.props));
    this.$element = $tmp.firstChild;
    $tmp = null;
    if (this.props.className) {
      this.$element.classList.add(this.props.className);
    }
    this.componentAfterInit();
  }

  componentAfterInit() {}
  componentAfterRender() {}

  setParent(parent) {
    this.parent = parent;
    return this;
  }

  addChild(child) {
    if (child.parent) child.parent.removeChild(child);
    this.children.set(child.props.key, child);
    child.setParent(this);
    return child;
  }

  removeChild(key) {
    if (!this.children.has(key)) {
      console.warn(`Child with key '${key}' does not exist.`);
      return;
    }
    this.children.get(key).parent = null;
    this.children.delete(key);
    return this;
  }

  destroy() {
    if (this.$element) this.$element.remove();
    this.children.forEach((child, key) => {
      this.children.get(key).destroy();
    });
    this.children.clear();
    if (this.parent) this.parent.removeChild(this.props.key);
    this.$element = null;
    this.children = null;
    this.props = null;
    return null;
  }

  render(element, pos) {
    switch (pos) {
      case 'beforebegin':
        element.parentNode.insertBefore(this.$element, element);
        break;
      case 'afterbegin':
        element.insertBefore(this.$element, element.firstChild);
        break;
      case 'afterend':
        element.parentNode.insertBefore(this.$element, element.nextSibling);
        break;
      default:
        element.appendChild(this.$element);
        break;
    }
    this.componentAfterRender();
    return this;
  }
}
