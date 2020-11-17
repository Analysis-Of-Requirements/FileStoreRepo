import ListItemComponent from '../list-item-component.js';
import FileType from './file-type.js';
import Glyphicon from '../../glyphicon.js';
import EventHandlersStorage from '../../../event/event-handlers-storage.js';

/**
 * Component for rendering file model.
 */
export default class FileComponent extends ListItemComponent {

  /**
   * Downloading state of component.
   * @type {boolean}
   */
  _isDownloadingInProgress;

  /**
   * Instantiates File Component.
   *
   * @param {Element} container - parent element.
   * @param {FileModel} listItem - model with data to render.
   */
  constructor(container, {listItem}) {
    super(container, {listItem});
  }

  /**
   * @inheritdoc
   */
  initComponent() {
    this._onDownloadClickHandlers = new EventHandlersStorage();
    super.initComponent();
  }

  /**
   * @inheritdoc
   * @return {string} markup of list item element.
   */
  markup() {
    const {_isDeletionInProgress, _isSelected, _isInEditingMode, _isRenamingInProgress, properties,
      _isDownloadingInProgress} = this;
    const {name, size, fileType} = properties.listItem;
    const iconMarkup = this._createIconMarkup(fileType);
    const sizeMarkup = this._processSize(size);

    return `
      <tr class="
            ${_isDeletionInProgress ? 'deletion-in-progress' : ''} 
            ${_isSelected ? 'selected-list-item' : ''} 
            ${_isInEditingMode ? 'editing' : ''} 
            ${_isRenamingInProgress ? 'renaming' : ''} 
            ${_isDownloadingInProgress ? 'downloading' : ''}
            " data-type="list-item-component" data-test="file-component">
        <td class="table-col-type" data-test="file-component-type">&nbsp;</td>
        ${iconMarkup}
        <td class="table-col-name text-overflow-ellipsis" data-test="file-component-name">
          <div class="renaming-loader"></div>
          <p data-type="file-component-name" data-name="${name}">${name}</p>
          <input class="input" data-type="list-item-input" type="text" name="name" value="${name}">
        </td>
        <td class="table-col-size" data-test="file-component-size">
          ${sizeMarkup}
        </td>
        <td class="table-col-buttons" data-test="file-component-buttons">
          <div class="file-downloading-item" data-type="file-downloading-item"></div>
          <button class="table-col-button" title="Download" data-type="list-item-download-button"></button>
          <button class="table-col-button" title="Remove" data-type="list-item-remove-button"></button>
        </td>
      </tr>
    `;
  }

  /**
   * @inheritdoc
   */
  initNestedComponents() {
    super.initNestedComponents();
    const {rootElement, _isInEditingMode, _onDownloadClickHandlers, properties} = this;

    const removeIconContainer = rootElement.querySelector('[data-type="list-item-remove-button"]');
    new Glyphicon(removeIconContainer, {
      glyphIconClass: 'glyphicon-remove-circle',
    });

    const downloadIconContainer = rootElement.querySelector('[data-type="list-item-download-button"]');
    new Glyphicon(downloadIconContainer, {
      glyphIconClass: 'glyphicon-download',
    });

    const {listItem} = properties;

    const downloadElement = rootElement.querySelector('[data-type="list-item-download-button"]');
    downloadElement.addEventListener('click', () => {
      _onDownloadClickHandlers.executeHandlers(listItem);
    });

    if (_isInEditingMode) {
      this._getInputElement().focus();
    }
  }

  /**
   * Factory method for creating markup of icon of file component.
   *
   * @param {string} fileType - description of file, which helps to differentiate markup.
   * @private
   * @return {string} icon markup.
   */
  _createIconMarkup(fileType) {
    const {DOC, IMAGE, MUSIC, SPREADSHEET, VIDEO, UNDEFINED} = FileType;
    const fileTypeIconClassMap = {
      [DOC]: 'glyphicon-book',
      [IMAGE]: 'glyphicon-picture',
      [SPREADSHEET]: 'glyphicon-list-alt',
      [VIDEO]: 'glyphicon-film',
      [MUSIC]: 'glyphicon-music',
      [UNDEFINED]: 'glyphicon-file',
    };
    const mappedClass = fileTypeIconClassMap[fileType];
    const undefineClass = fileTypeIconClassMap[UNDEFINED];
    const iconClass = mappedClass || undefineClass;

    return `
      <td class="table-col-icon">
        <span class="glyphicon ${iconClass}" data-test="file-component-icon"></span>
      </td>
    `;
  }

  /**
   * Processes bytes to display relevant unit of digital information.
   *
   * @param {number} bytes - bytes to process.
   * @return {string} - string representation of unit of digital information.
   * @private
   */
  _processSize(bytes) {
    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    let i;
    for (i = 0; i < units.length && bytes >= 1024; ++i) {
      bytes /= 1024;
    }

    return `${Number.parseFloat(bytes.toPrecision(3))} ${units[i]}`;
  }

  /**
   * @inheritdoc
   */
  _getInputElement() {
    return this.rootElement.querySelector('[data-type="list-item-input"]');
  }

  /**
   * Sets file to downloading in progress state.
   *
   * @param {boolean} inProgress - is file downloading in progress.
   */
  set isDownloadingInProgress(inProgress) {
    this._isDownloadingInProgress = inProgress;
    this._rerender();
  }

  /**
   * Getter for downloading in progress field.
   *
   * @return {boolean} is file in downloading state.
   */
  get isDownloadingInProgress() {
    return this._isDownloadingInProgress;
  }

  /**
   * Registers on download click handlers.
   *
   * @param {function(FileModel): void} handler - on download click handler.
   */
  onDownloadButtonClick(handler) {
    this._onDownloadClickHandlers.addEventHandler(handler);
  }
}
