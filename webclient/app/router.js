import RouterBuilder from './router-builder.js';

/**
 * Manages routing behaviour and is responsible for rendering pages, mapped to routes.
 */
export default class Router {

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
  _hashChangeHandlers;

  /**
   * Currently rendered page.
   * @type {Component}
   * @private
   */
  _activePage;

  /**
   * Creates instance of Router.
   *
   * @param {Window} window - global window object.
   * @param {HTMLElement} pageContainer - container for pages.
   * @param {{key: string, value: (function(router: Router): Component)}} pageMappings - is map of key value pairs,
   * where key is a hash and value is a creator of component.
   * @param {string} defaultUrlHash - default uri hash used to refer to page when no hash provided.
   * @param {function(string, string): Component} notFoundPageCreator - creates a page to display in case of wrongly-typed
   * hash.
   * @param {(function(string, string))[]} hashChangeHandlers - handlers for event when hash changes.
   */
  constructor(window, pageContainer, pageMappings, defaultUrlHash, notFoundPageCreator,
    hashChangeHandlers) {
    this._window = window;
    this._pageContainer = pageContainer;
    this._pageMappings = pageMappings;
    this._defaultUrlHash = defaultUrlHash;
    this._notFoundPageCreator = notFoundPageCreator;
    this._hashChangeHandlers = hashChangeHandlers;
    this._init();
  }

  /**
   * Initializes router.
   * @private
   */
  _init() {
    this._window.addEventListener('hashchange', () => {
      this._initiatePageRendering();
    });

    // Calling this method is significant to respond reloading page.
    this._initiatePageRendering();
  }

  /**
   * Initiates page rendering, considering current url.
   * @private
   */
  _initiatePageRendering() {
    const urlHash = this._readUrlHash();

    if (urlHash) {
      this._loadPageForHash(urlHash);
    } else {
      this.redirectTo(this._defaultUrlHash);
    }
  }

  /**
   * Loads page for given url hash.
   *
   * @param {string} hash - url hash.
   * @private
   */
  _loadPageForHash(hash) {
    const urlTemplate = this._retrieveUrlTemplate(hash);

    if (!urlTemplate) {
      this._renderPage(hash);
      this._executeHashChangedHandlers(hash, {});
      return;
    }

    this._renderPage(urlTemplate);
    const staticPart = this._getStaticPart(urlTemplate);
    const dynamicPart = this._getDynamicPart(urlTemplate, hash);
    this._executeHashChangedHandlers(staticPart, dynamicPart);
  }

  /**
   * Renders ui page, mapped to passed urlTemplate.
   * Before rendering new page, clears content root container, e.g. previous page.
   *
   * @param {string} urlTemplate - defines url structure.
   * @private
   */
  _renderPage(urlTemplate) {
    this._clearActivePage();
    const createPage = this._getPageCreator(urlTemplate);

    this._activePage = createPage ? createPage(this) : this._notFoundPageCreator();
  }

  /**
   * Renders not-found-page.
   * @param {string} resourceName - name of not found resource.
   * @param {string} linkToFollow - link to follow to leave not found page.
   */
  renderNotFoundPage(resourceName, linkToFollow) {
    this._clearActivePage();
    this._activePage = this._notFoundPageCreator(resourceName, linkToFollow);
  }

  /**
   * Clears content of currently rendered page.
   * @private
   */
  _clearActivePage() {
    if (this._activePage) {
      this._activePage.willDestroy();
    }

    this._pageContainer.innerHTML = '';
  }

  /**
   * Executes handlers for hash-changed event.
   *
   * @param {string} staticPart - static part of the url.
   * @param {object} dynamicPart - dynamic part of the url.
   * @private
   */
  _executeHashChangedHandlers(staticPart, dynamicPart) {
    this._hashChangeHandlers.forEach((handler) => handler(staticPart, dynamicPart));
  }

  /**
   * Read hash of current url.
   *
   * @return {string} url hash.
   * @private
   */
  _readUrlHash() {
    return this._window.location.hash.slice(1);
  }

  /**
   * Retrieves page creator for provided url template.
   *
   * @param {string} urlTemplate - defines how url can be built.
   * @return {function(router: Router): Component} page creator.
   */
  _getPageCreator(urlTemplate) {
    return this._pageMappings[urlTemplate];
  }

  /**
   * Sets hash current url.
   *
   * @param {string} hash - hash route.
   */
  redirectTo(hash) {
    this._window.location.hash = `#${hash}`;
  }

  /**
   * Retrieves template for asked hash.
   *
   * @param {string} hash - url hash.
   * @return {string} template mapped to the hash.
   * @private
   */
  _retrieveUrlTemplate(hash) {
    const {_pageMappings} = this;

    return Object.keys(_pageMappings)
      .find((urlTemplate) => {
        const staticPart = this._getStaticPart(urlTemplate);
        return hash.startsWith(staticPart);
      });
  }

  /**
   * Retrieves static part oth url provided.
   *
   * @param {string} urlTemplate - url template.
   * @return {string} - static part of the template.
   * @private
   */
  _getStaticPart(urlTemplate) {
    const secondSlashPosition = urlTemplate.indexOf('/', 1);
    return secondSlashPosition > 0 ?
      urlTemplate.slice(0, secondSlashPosition) :
      urlTemplate.slice(0);
  }

  /**
   * Retrieves dynamic part of the url by given hash.
   *
   * @param {string} urlTemplate - url template.
   * @param {string} url - queried template.
   * @return {object} - map of key - resource pairs.
   * @private
   */
  _getDynamicPart(urlTemplate, url) {
    const templatePart = urlTemplate.split('/');
    const urlParts = url.split('/');

    return templatePart.reduce((accumulator, value, index) => {
      if (!value.startsWith(':')) {
        return accumulator;
      }
      const key = value.slice(1);
      accumulator[key] = urlParts[index];
      return accumulator;
    }, {});
  }

  /**
   * Creates builder for router.
   *
   * @return {RouterBuilder} - router builder.
   */
  static getBuilder() {
    return new RouterBuilder();
  }
}
