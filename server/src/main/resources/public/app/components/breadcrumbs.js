import Component from './component.js';

/**
 * Component for rendering breadcrumb element.
 */
export default class Breadcrumbs extends Component {

  /**
   * Trail text.
   * @type {string}
   * @private
   */
  _trailText;

  /**
   * Id of parent folder.
   * @type {string}
   * @private
   */
  _parentFolderId;

  /**
   * Error state of breadcrumbs.
   * @type {boolean}
   * @private
   */
  _isError;

  /**
   * Instantiates Breadcrumbs.
   *
   * @param {HTMLElement} container - parent container.
   * @param {boolean} isLoading - initial loading state.
   */
  constructor(container, {isLoading}) {
    super(container, {
      _isLoading: isLoading,
    });
  }

  /**
   * @inheritdoc
   * @return {string} - root DOM breadcrumb element with markup.
   */
  markup() {
    const {_isError, _trailText = '', _parentFolderId, properties} = this;
    const {_isLoading} = properties;

    return `
      <div class="breadcrumbs" data-test="breadcrumbs">
        <div class="cell-icons" data-type="breadcrumbs-icon-container">
          ${_isLoading ? '<div class="folder-loader" data-type="folder-loader"></div>' : this._getIconMarkup(_parentFolderId)}
        </div>
        <div class="cell-name text-overflow-ellipsis ${_isError ? 'error-text' : ''}" data-type="breadcrumbs-text">
          / ${_trailText}
        </div>      
      </div>
    `;
  }

  /**
   * Retrieves markup of icon element.
   *
   * @param {string} parentFolderId - if of parent folder.
   * @return {string} markup of icon.
   * @private
   */
  _getIconMarkup(parentFolderId = '') {

    if (parentFolderId) {
      return `
        <a href="#/folder/${parentFolderId}" title="Back" data-type="breadcrumbs-parent-folder-id">
          <span class="glyphicon glyphicon-level-up" data-test="glyphicon"></span>
        </a>
      `;
    }

    return `
      <span class="glyphicon glyphicon-folder-open" data-test="glyphicon"></span>
    `;
  }

  /**
   * Renders link to parent page and name of current one.
   *
   * @param {string} trailText - name of current page.
   * @param {string} parentId - id of parent.
   */
  renderTrail(trailText, parentId) {
    this._trailText = trailText;
    this._parentFolderId = parentId;
    this.properties._isLoading = false;
    this._isError = false;
    this._rerender();
  }

  /**
   * Renders loader inside icon container.
   */
  renderLoader() {
    this._trailText = '...';
    this.properties._isLoading = true;
    this._isError = false;
    this._rerender();
  }

  /**
   * Renders error on place of breadcrumbs.
   *
   * @param {string} errorMessage - error containing message.
   */
  renderErrorMessage(errorMessage) {
    this._trailText = errorMessage;
    this._parentFolderId = '';
    this.properties._isLoading = false;
    this._isError = true;
    this._rerender();
  }
}
