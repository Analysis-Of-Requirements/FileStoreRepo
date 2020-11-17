import Component from './component.js';
import EventHandlersStorage from '../event/event-handlers-storage.js';

/**
 * Component for rendering button element.
 */
export default class Button extends Component {

  /**
   * @name ButtonClickHandler
   * @function
   * @param {Event} event - click event.
   */

  /**
   * Instantiates Button component.
   *
   * @param {HTMLElement} container - parent container.
   * @param {object} properties - configuration properties for Anchor component.
   * @param {string} properties.type - value of type attribute.
   * @param {string} properties.textContent - value of text content attribute.
   * @param {string} properties.title - text to display when mouse points at element.
   * @param {string} properties.glyphiconClass - class of icon to add.
   * @param {string} properties.additionalClass - classes to add.
   * @param {boolean} properties.isLoading - is button loading or not.
   */
  constructor(container, {
      type,
      textContent,
      title,
      glyphiconClass = '',
      additionalClass = '',
      isLoading,
    },
  ) {
    super(container, {
      _type: type,
      _textContent: textContent,
      _title: title,
      _glyphiconClass: glyphiconClass,
      _additionalClass: additionalClass,
      _isLoading: isLoading,
    });
  }

  initComponent() {
    this._onClickHandlers = new EventHandlersStorage();
    super.initComponent();
  }

  /**
   * @inheritdoc
   * @return {string} markup of <a> element.
   */
  markup() {
    const {_type, _title, _additionalClass, _isLoading} = this.properties;

    return `
      <button class="button ${_additionalClass ? _additionalClass : ''} ${_isLoading ? 'loading' : ''}" 
        type="${_type}"
        title="${_title}"
        data-test="button">
        ${this._innerContent()}  
      </button>
    `;
  }

  /**
   * Retrieves inner content of button.
   *
   * @return {string} - inner content. May be HTML or just text.
   * @private
   */
  _innerContent() {
    const {_textContent, _glyphiconClass} = this.properties;

    return `${_glyphiconClass ? ('<span class="glyphicon ' + _glyphiconClass + '"></span>') : ''} ${_textContent}`;
  }

  /**
   * Adds handler for button click event.
   *
   * @param {ButtonClickHandler} handler of button click event.
   */
  addClickHandler(handler) {
    this._onClickHandlers.addEventHandler(handler);
  }

  /**
   * @inheritdoc
   * @override
   */
  addEventListeners() {
    const {rootElement} = this;

    rootElement.addEventListener('click', (event) => {

      if (this.properties._isLoading) {
        return;
      }

      this._onClickHandlers.executeHandlers(event);
    });
  }

  /**
   * Sets type attribute for button element.
   *
   * @param {string} type attribute value of button element.
   */
  set type(type) {
    this.properties._type = type;
    this._rerender();
  }

  /**
   * Sets text content of button element.
   *
   * @param {string} textContent of button element.
   */
  set textContent(textContent) {
    this.properties._textContent = textContent;
    this._rerender();
  }

  /**
   * Setter for is loading state of button.
   *
   * @param {boolean} isLoading - defines loading state.
   */
  set isLoading(isLoading) {
    this.properties._isLoading = isLoading;
    this._rerender();
  }

  /**
   * Getter for is loading state.
   *
   * @return {boolean} is loading state.
   */
  get isLoading() {
    return this.properties._isLoading;
  }
}
