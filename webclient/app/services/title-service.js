/**
 * Service is needed for managing content of document title.
 */

export default class TitleService {

  /**
   * Main part of the title: <page-name> - <caption>.
   * @type {string}
   * @private
   */
  _caption;

  /**
   * Page name of the title: <page-name> - <caption>.
   * @type {string}
   * @private
   */
  _page;

  /**
   * Instance of document class.
   * @type {Document}
   * @private
   */
  _document;

  /**
   * Instantiates title service.
   * @param {Document} document - instance of document object.
   * @param {object} titles - object containing tab titles.
   * @param {string} titles.caption - Main part of the title.
   * @param {string} titles.page - name of the page.
   */
  constructor(document, {caption = 'FileHub', page = ''} = {}) {
    this._document = document;
    this._caption = caption;
    this._page = page;
    this._init();
  }

  /**
   * Initializes service.
   * Will be called after instantiation.
   * @private
   */
  _init() {
    this._renderTitle();
  }

  /**
   * Renders title on the tab.
   * @private
   */
  _renderTitle() {
    const {_page, _caption, _document} = this;
    const pageName = _page ? `${_page} - ` : '';
    _document.title = `${pageName}${_caption}`;
  }

  /**
   * Sets page name of the title.
   * @param {string} page - page name.
   */
  setPage(page) {
    this._page = page;
    this._renderTitle();
  }
}
