import ListItemComponent from '../list-item-component.js';
import Glyphicon from '../../glyphicon.js';
import EventHandlersStorage from '../../../event/event-handlers-storage.js';

/**
 * Component for rendering folder model.
 */
export default class FolderComponent extends ListItemComponent {

  /**
   * Instantiates Folder Component.
   *
   * @param {Element} container - parent element.
   * @param {FolderModel} listItem - model with data to render.
   */
  constructor(container, {listItem}) {
    super(container, {listItem});
  }

  /**
   * @inheritdoc
   * @return {string} markup of list item element.
   */
  markup() {
    const {_isDeletionInProgress, _isSelected, _isInEditingMode, _isRenamingInProgress, _hasUploadingFile, properties} =
      this;
    const {name, itemsAmount} = properties.listItem;

    return `
      <tr class="
          ${_isDeletionInProgress ? 'deletion-in-progress' : ''}
          ${_isSelected ? 'selected-list-item' : ''}
          ${_isInEditingMode ? 'editing' : ''}
          ${_isRenamingInProgress ? 'renaming' : ''}
          ${_hasUploadingFile ? 'uploading-folder' : ''}
          " data-type="list-item-component" data-test="folder-component">
        <td class="table-col-type" data-test="folder-component-type"></td>
        <td class="table-col-icon" data-type="folder-icon-container"></td>
        <td class="table-col-name text-overflow-ellipsis" data-test="folder-component-name">
          <div class="renaming-loader"></div>
          <p class="paragraph" data-type="folder-component-name" data-name="${name}">${name}</p>
          <input class="input" data-type="list-item-input" type="text" name="name" value="${name}">
        </td>
        <td class="table-col-size" data-test="folder-component-size">
          ${itemsAmount} ${itemsAmount === 1 ? 'item' : 'items'} 
        </td>
        <td class="table-col-buttons" data-test="folder-component-buttons">
          <div class="folder-uploading-item" data-type="folder-uploading-item"></div>
          <button class="table-col-button" title="Upload" data-type="list-item-upload-button"></button>           
          <button class="table-col-button" title="Remove" data-type="list-item-remove-button"></button>
        </td>
      </tr>
    `;
  }

  /**
   * @inheritdoc
   */
  initComponent() {
    this._onDoubleClickHandlers = new EventHandlersStorage();
    this._onUploadButtonClickHandlers = new EventHandlersStorage();
    super.initComponent();
  }

  /**
   * @inheritdoc
   */
  initNestedComponents() {
    super.initNestedComponents();
    const {rootElement, _isInEditingMode, _onUploadButtonClickHandlers, properties} = this;

    const rightArrowIconContainer = rootElement.querySelector('[data-test="folder-component-type"]');
    new Glyphicon(rightArrowIconContainer, {
      glyphIconClass: 'glyphicon-menu-right',
    });

    const folderIconContainer = rootElement.querySelector('[data-type="folder-icon-container"]');
    new Glyphicon(folderIconContainer, {
      glyphIconClass: 'glyphicon-folder-close',
    });

    const uploadIconContainer = rootElement.querySelector('[data-type="list-item-upload-button"]');
    new Glyphicon(uploadIconContainer, {
      glyphIconClass: 'glyphicon-upload',
    });

    uploadIconContainer.addEventListener('click', () => {
      _onUploadButtonClickHandlers.executeHandlers(properties.listItem);
    });

    const removeIconContainer = rootElement.querySelector('[data-type="list-item-remove-button"]');
    new Glyphicon(removeIconContainer, {
      glyphIconClass: 'glyphicon-remove-circle',
    });

    if (_isInEditingMode) {
      this._getInputElement().focus();
    }
  }

  /**
   * @inheritdoc
   */
  addEventListeners() {
    super.addEventListeners();

    this.rootElement.addEventListener('dblclick', (event) => {
      this._onDoubleClickHandlers.executeHandlers(event);
    });
  }

  /**
   * Adds on-double-click event handler.
   *
   * @param {function(Event): void} handler - handler for double click event.
   */
  onDoubleClick(handler) {
    this._onDoubleClickHandlers.addEventHandler(handler);
  }

  /**
   * @inheritdoc
   */
  _getInputElement() {
    return this.rootElement.querySelector('[data-type="list-item-input"]');
  }

  /**
   * Sets folder to child-file-uploading state.
   *
   * @param {boolean} inProgress - is child-file in progress.
   */
  set isUploadingFileInProgress(inProgress) {
    this._hasUploadingFile = inProgress;
    this._rerender();
  }

  /**
   * Registers handler for upload-button click.
   *
   * @param {function(FolderModel)} handler - click handler.
   */
  onUploadButtonClick(handler) {
    this._onUploadButtonClickHandlers.addEventHandler(handler);
  }
}
