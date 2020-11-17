import Component from '../component.js';
import EventHandlersStorage from '../../event/event-handlers-storage.js';

/**
 * Component for rendering list item.
 * @abstract
 */
export default class ListItemComponent extends Component {

  /**
   * Defines whether list item deletion in progress or not.
   * @type {boolean}
   * @private
   */
  _isDeletionInProgress;

  /**
   * Defines selection state of the component.
   * @type {boolean}
   * @private
   */
  _isSelected = false;

  /**
   * Defines editing mode of the component.
   * @type {boolean}
   * @private
   */
  _isInEditingMode = false;

  /**
   * Defines whether item renaming in process or not.
   * @type {boolean}
   * @private
   */
  _isRenamingInProgress = false;

  /**
   * Instantiates List Item Component.
   *
   * @param {Element} container - parent element.
   * @param {ListItemModel} listItem - model with data to render.
   */
  constructor(container, {listItem}) {
    super(container, {listItem});
    this._deleteButtonClickHandlers = new EventHandlersStorage();
    this._onClickHandlers = new EventHandlersStorage();
    this._onInputCommitHandlers = new EventHandlersStorage();
    this._onInputBlurHandlers = new EventHandlersStorage();
  }

  /**
   * @inheritdoc
   */
  initComponent() {
    this._fakeElementType = 'tbody';
    super.initComponent();
  }

  /**
   * @inheritdoc
   */
  initNestedComponents() {
    super.initNestedComponents();

    const deleteButton = this.rootElement.querySelector('[data-type="list-item-remove-button"]');
    deleteButton.addEventListener('click', (event) => {
      this._deleteButtonClickHandlers.executeHandlers(event);
    });

    const inputElement = this._getInputElement();
    inputElement.addEventListener('focusout', (event) => {
      this._onInputBlurHandlers.executeHandlers(event);
    });

    inputElement.addEventListener('keyup', (event) => {

      if (event.key !== "Enter") {
        return;
      }

      this._onInputCommitHandlers.executeHandlers(inputElement.value);
    });
  }

  /**
   * @inheritdoc
   */
  addEventListeners() {
    const {rootElement} = this;

    rootElement.addEventListener('click', (event) => {
      this._onClickHandlers.executeHandlers(event);
    });
  }

  /**
   * Adds on delete-button-clicked event handler.
   *
   * @param {function(): void} handler - handler for delete-button-clicked event.
   */
  onDeleteButtonClick(handler) {
    this._deleteButtonClickHandlers.addEventHandler(handler);
  }

  /**
   * Sets deletion in progress state of component.
   *
   * @param {boolean} inProgress - is list item deletion in progress or not.
   */
  set isDeletionInProgress(inProgress) {
    this._isDeletionInProgress = inProgress;
    this._rerender();
  }

  /**
   * Getter for isDeletionInProgress.
   *
   * @return {boolean} deletion in progress or not.
   */
  get isDeletionInProgress() {
    return this._isDeletionInProgress;
  }

  /**
   * Setter of isSelected property.
   *
   * @param {boolean} isSelected - selection state of component.
   */
  set isSelected(isSelected) {
    this._isSelected = isSelected;
    this._rerender();
  };

  /**
   * Getter of isSelected property.
   *
   * @return {boolean} - selection state of the component.
   */
  get isSelected() {
    return this._isSelected;
  }

  /**
   * Setter for editing mode of component.
   *
   * @param {boolean} isEditing - editing mode.
   */
  set isInEditingMode(isEditing) {
    this._isInEditingMode = isEditing;
    this._rerender();
  }

  /**
   * Getter of editing state of component.
   *
   * @return {boolean} editing state.
   */
  get isInEditingMode() {
    return this._isInEditingMode;
  }

  /**
   * Sets the renaming state.
   *
   * @param {boolean} isRenaming - is renaming in process.
   */
  set isRenamingInProgress(isRenaming) {
    this._isRenamingInProgress = isRenaming;
    this._rerender();
  }

  /**
   * Getter for is renaming in progress state.
   *
   * @return {boolean} renaming in progress state.
   */
  get isRenamingInProgress() {
    return this._isRenamingInProgress;
  }

  /**
   * Adds on-click event handler.
   *
   * @param {function(Event): void} handler - handler for click event.
   */
  onClick(handler) {
    this._onClickHandlers.addEventHandler(handler);
  }

  /**
   * Adds on-change-event handler.
   *
   * @param {function(inputValue: String): void} handler - handler for change-input event.
   */
  onInputCommit(handler) {
    this._onInputCommitHandlers.addEventHandler(handler);
  }

  /**
   * Registers on-input-blur event handler.
   *
   * @param {function()} handler - handler for input blur event.
   */
  onInputFocusOut(handler) {
    this._onInputBlurHandlers.addEventHandler(handler);
  }

  /**
   * Retrieves component's input element.
   *
   * @return {HTMLElement} input element.
   * @abstract
   * @protected
   */
  _getInputElement() {
  }
}
