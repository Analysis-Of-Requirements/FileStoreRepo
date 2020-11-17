import Router from './router.js';

/**
 * Builder for router.
 */
export default class RouterBuilder {

  /**
   * Global window object.
   * @type {Window}
   * @private
   */
  _window;

  /**
   * Container for pages.
   * @type {HTMLElement}
   * @private
   */
  _pageContainer;

  /**
   * Is map of key value pairs, where key is a hash and value is a creator of component.
   * @type {{key: string, value: (function(router: Router): Component)}}
   * @private
   */
  _pageMappings;

  /**
   * Default uri hash used to refer to page when no hash provided.
   * @type {string}
   * @private
   */
  _defaultUrlHash;

  /**
   * Creates a page to display in case of wrongly-typed hash.
   * @type {function(string, string): Component}
   * @private
   */
  _notFoundPageCreator;

  /**
   * Handlers for event when hash changes.
   * @type {function(staticPart: string, dynamicPart: string)[]}
   * @private
   */
  _hashChangeHandlers = [];

  /**
   * Adds reference to window.
   *
   * @param {Window} windowObject - global window object.
   * @return {RouterBuilder}
   */
  withWindow(windowObject) {
    this._window = windowObject;
    return this;
  }

  /**
   * Adds page container.
   *
   * @param {HTMLElement} pageContainer - container for pages.
   * @return {RouterBuilder}
   */
  withPageContainer(pageContainer) {
    this._pageContainer = pageContainer;
    return this;
  }

  /**
   * Adds page mappings to router.
   *
   * @param {{key: string, value: (function(router: Router): Component)}} pageMappings - is map of key value pairs,
   * where key is a hash and value is a creator of component.
   * @return {RouterBuilder}
   */
  withPageMappings(pageMappings) {
    this._pageMappings = pageMappings;
    return this;
  }

  /**
   * Adds default url hash.
   *
   * @param {string} defaultUrlHash - default uri hash used to refer to page when no hash provided.
   * @return {RouterBuilder}
   */
  withDefaultUrlHash(defaultUrlHash) {
    this._defaultUrlHash = defaultUrlHash;
    return this;
  }

  /**
   * Adds not-found-page-creator.
   *
   * @param {function(string, string): NotFoundPage} notFoundPageCreator - creates a page to display in case of wrongly-typed hash.
   * @return {RouterBuilder}
   */
  withNotFoundPageCreator(notFoundPageCreator) {
    this._notFoundPageCreator = notFoundPageCreator;
    return this;
  }

  /**
   * Adds hash-changed handler.
   *
   * @param {function(staticPart: string, dynamicPart: string)} handler - handler for event when hash changes.
   * @return {RouterBuilder}
   */
  withHashChangeHandler(handler) {
    this._hashChangeHandlers.push(handler);
    return this;
  }

  /**
   * Builds router.
   *
   * @return {Router} - built router.
   */
  build() {
    return new Router(this._window, this._pageContainer, this._pageMappings, this._defaultUrlHash,
      this._notFoundPageCreator, this._hashChangeHandlers);
  }
}
