import Breadcrumbs from '../components/breadcrumbs.js';
import StateAwareComponent from '../components/state-aware-component.js';
import AuthenticationError from '../models/errors/authentication-error.js';
import EventHandlersStorage from '../event/event-handlers-storage.js';
import GeneralServerError from '../models/errors/general-server-error.js';
import GetFolderAction from '../actions/get-folder-action.js';
import ResourceNotFoundError from '../models/errors/resource-not-found-error.js';
import GetRootFolderAction from '../actions/get-root-folder-action.js';

/**
 * Page for rendering file list inside and managing list items.
 */
export default class FileListExplorer extends StateAwareComponent {

  /**
   * Instantiates List Explorer.
   *
   * @param {HTMLElement} container - parent element.
   * @param {StateManager} stateManager - manages access to state.
   * @param {object} properties - configuration properties for the component.
   * @param {TitleService} properties.titleService - title service for managing text on page tab.
   * @param {ToastService} toastService - service for toast messages.
   */
  constructor(container, stateManager, {
    titleService,
    toastService,
  }) {
    super(container, stateManager, {titleService, toastService});
  }

  /**
   * @inheritdoc
   */
  initComponent() {
    super.initComponent();
    this.properties.titleService.setPage('File List');
    this._onAuthenticationErrorHandlers = new EventHandlersStorage();
    this._onResourceNotFoundErrorHandlers = new EventHandlersStorage();
    this._redirectToFolderCallbacks = new EventHandlersStorage();
  }

  /**
   * @inheritdoc
   * @return {string} - markup of explorer page.
   */
  markup() {
    return `
      <div class="application-box" data-type="application-box" data-test="list-explorer">
        <a class="logo" href="#" title="FileStore">
            <img src="images/filestore.png" alt="FileStore">
        </a>
        
        <ul class="nav-list">
        </ul>
        
        <header class="header">
            <h1><a href="#" title="File Explorer">File Explorer</a></h1>
        </header>
        
        <hr>
        
        <main class="main" data-type="file-list-container">
            <div class="menu">
                <div class="breadcrumbs-container" data-type="breadcrumbs-container"></div>
                <div data-type="folder-content-loader"></div>
                <div class="cell-actions" data-type="cell-actions"></div>
            </div>
        </main>

        <hr>

        <footer class="footer">
            <p class="center-text">Copyright &copy; 2020
                <a href="#" title="FileStore">FileStore</a>. All rights reserved.
            </p>
        </footer>    
      </div>
    `;
  }

  /**
   * @inheritdoc
   */
  initNestedComponents() {
    const {rootElement} = this;

    const breadCrumbsContainer = rootElement.querySelector('[data-type="breadcrumbs-container"]');
    this.breadcrumbsComponent = new Breadcrumbs(breadCrumbsContainer, {
      isLoading: true,
    });
  }

  /**
   * @inheritdoc
   */
  initState() {
    const {breadcrumbsComponent} = this;

    this.onStateChanged('folder', (state) => {
      const {name, parentId} = state.folder;
      breadcrumbsComponent.renderTrail(name, parentId);
    });

    this.onStateChanged('isFolderLoading', (state) => {
      if (state.isFolderLoading) {
        breadcrumbsComponent.renderLoader();
      }
    });

    this.onStateChanged('folderLoadingError', (state) => {
      this._handleFolderLoadingError(state.folderLoadingError);
    });

    this.onStateChanged('locationParams', async (state) => {
      const {folderId} = state.locationParams;

      if (folderId) {
        await this.dispatch(new GetFolderAction(folderId));
      } else {
        await this.dispatch(new GetRootFolderAction());
      }
    });

    this.onStateChanged('rootFolder', (state) => {
      this._executeRedirectToFolderCallbacks(state.rootFolder.id);
    });

    this.onStateChanged('rootFolderLoadingError', (state) => {
      this._handleFolderLoadingError(state.rootFolderLoadingError);
    });
  }

  /**
   * Handles folder loading error.
   *
   * @param {Error} error - folder loading error.
   * @private
   */
  _handleFolderLoadingError(error) {
    const {breadcrumbsComponent} = this;

    if (error instanceof AuthenticationError) {
      breadcrumbsComponent.renderErrorMessage(error.message);
      this._handleAuthenticationError();
    } else if (error instanceof ResourceNotFoundError) {
      breadcrumbsComponent.renderErrorMessage(error.message);
      this._handleResourceNotFoundError('Folder', '/folder');
    } else if (error instanceof GeneralServerError) {
      breadcrumbsComponent.renderErrorMessage('Cannot retrieve folder from server.');
    }
  }

  /**
   * Handles authentication error.
   * @private
   */
  _handleAuthenticationError() {
    this._onAuthenticationErrorHandlers.executeHandlers();
  }

  /**
   * Registers authentication-error handler.
   *
   * @param {function()} handler - handler to register.
   */
  onAuthenticationError(handler) {
    this._onAuthenticationErrorHandlers.addEventHandler(handler);
  }

  /**
   * Handles resource-not-found error.
   *
   * @param {string} resourceName - name of not found resource.
   * @param {string} linkToFollow - link to follow to leave not found page.
   * @private
   */
  _handleResourceNotFoundError(resourceName, linkToFollow) {
    this._onResourceNotFoundErrorHandlers.executeHandlers(resourceName, linkToFollow);
  }

  /**
   * Registers resource-not-found-error handler.
   *
   * @param {function(string, string)} handler - handler to register.
   */
  onResourceNotFoundError(handler) {
    this._onResourceNotFoundErrorHandlers.addEventHandler(handler);
  }

  /**
   * Executes redirect-to-folder callbacks.
   *
   * @param {string} folderId - id of folder.
   * @private
   */
  _executeRedirectToFolderCallbacks(folderId) {
    this._redirectToFolderCallbacks.executeHandlers(folderId);
  }

  /**
   * Registers callbacks, that redirects to folder.
   *
   * @param {function(folderId: string): void} handler - handler to register.
   */
  addRedirectToFolderCallback(handler) {
    this._redirectToFolderCallbacks.addEventHandler(handler);
  }
}
