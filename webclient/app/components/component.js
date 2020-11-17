/**
 * UI component.
 * Allows to write html blocks of code in JavaScript instead of in html.
 */
export default class Component {

  /**
   * Html main element of component.
   */
  rootElement;

  /**
   * Container Html element for component.
   */
  container;

  /**
   * Supplementary values, needed for the component.
   */
  properties;

  /**
   * Html element type needed while rendering component.
   * @type {string}
   * @protected
   */
  _fakeElementType = 'div';

  /**
   * Instantiates Component.
   *
   * @param {Element} container of the component.
   * @param {object} properties - configuration properties for the component.
   */
  constructor(container, properties = {}) {
    this.container = container;
    this.properties = properties;
    this.initComponent();
  }

  /**
   * Initializes component.
   */
  initComponent() {
    this.render();
    this.initNestedComponents();
    this.addEventListeners();
  }

  /**
   * @return {string} html markup of the component.
   */
  markup() {

  }

  /**
   * Renders root element inside component container.
   * Root HTML Element of component is initialized here.
   */
  render() {
    const fakeElement = document.createElement(this._fakeElementType);
    fakeElement.innerHTML = this.markup();

    this.rootElement = fakeElement.firstElementChild;
    this.container.appendChild(this.rootElement);
  }

  /**
   * Rerenders part of component that may change during it's lifecycle.
   * @protected
   */
  _rerender() {
    const fakeElement = document.createElement(this._fakeElementType);
    fakeElement.innerHTML = this.markup();

    const newRootElement = fakeElement.firstElementChild;
    this.rootElement.innerHTML = newRootElement.innerHTML;

    const rootClassList = this.rootElement.classList;
    rootClassList.remove(...rootClassList.values());
    rootClassList.add(...newRootElement.classList.values());

    this.initNestedComponents();
  }

  /**
   * Initializes inner components.
   */
  initNestedComponents() {

  }

  /**
   * Adds event listeners for the component.
   */
  addEventListeners() {

  }

  /**
   * Destroys component.
   */
  willDestroy() {

  }
}
