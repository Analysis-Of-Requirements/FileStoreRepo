import UserDetails from '../components/user-details.js';
import Breadcrumbs from '../components/breadcrumbs.js';
import Button from '../components/button.js';
import FileList from '../components/file-list/file-list.js';
import StateAwareComponent from '../components/state-aware-component.js';
import AuthenticationError from '../models/errors/authentication-error.js';
import EventHandlersStorage from '../event/event-handlers-storage.js';
import GeneralServerError from '../models/errors/general-server-error.js';
import GetFolderAction from '../actions/get-folder-action.js';
import RefreshListAction from '../actions/refresh-list-action.js';
import ResourceNotFoundError from '../models/errors/resource-not-found-error.js';
import GetRootFolderAction from '../actions/get-root-folder-action.js';
import RemoveListItemAction from '../actions/remove-list-item-action.js';
import RenameListItemAction from '../actions/rename-list-item-action.js';
import LogOutAction from '../actions/log-out-action.js';
import CreateFolderAction from '../actions/create-folder-action.js';
import GetUserAction from '../actions/get-user-action.js';
import UploadFileAction from '../actions/upload-file-action.js';
import GetFileContentAction from '../actions/get-file-content-action.js';

/**
 * Page for rendering file list inside and managing list items.
 */
export default class FileListExplorer extends StateAwareComponent {

  /**
   * @type {Button}
   */
  _createFolderButton;

  /**
   * Instantiates List Explorer.
   *
   * @param {HTMLElement} container - parent element.
   * @param {StateManager} stateManager - manages access to state.
   * @param {object} properties - configuration properties for the component.
   * @param {TitleService} properties.titleService - title service for managing text on page tab.
   * @param {SelectFileService} selectFileService - service for selecting files from file system.
   * @param {BrowserFileDownloader} fileDownloader - service for downloading file to user's files system.
   * @param {ToastService} toastService - service for toast messages.
   */
  constructor(container, stateManager, {
    titleService,
    selectFileService,
    fileDownloader,
    toastService,
  }) {
    super(container, stateManager, {titleService, selectFileService, fileDownloader, toastService});
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
            <li data-type="user-details-container"></li>
            <li>
                <a href="#/login" title="Log Out" data-type="log-out-anchor">
                    Log Out <span class="glyphicon glyphicon-log-out"></span>
                </a>
            </li>
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
    const userDetailsContainer = rootElement.querySelector('[data-type="user-details-container"]');
    this._userDetails = new UserDetails(userDetailsContainer, {
      userName: '',
    });

    const breadCrumbsContainer = rootElement.querySelector('[data-type="breadcrumbs-container"]');
    this.breadcrumbsComponent = new Breadcrumbs(breadCrumbsContainer, {
      isLoading: true,
    });

    const buttonContainer = rootElement.querySelector('[data-type="cell-actions"]');

    this._createFolderButton = new Button(buttonContainer, {
      type: 'button',
      textContent: 'Create Folder',
      title: 'Create Folder',
      glyphiconClass: 'glyphicon-plus',
      additionalClass: 'alternative-button',
      isLoading: true,
    });

    this._createFolderButton.addClickHandler(async () => {
      const {state} = this.properties.stateManager;
      const createdFolder = await this.dispatch(new CreateFolderAction(state.folder));

      if (createdFolder && state.folder.id === createdFolder.parentId) {
        await this.dispatch(new RefreshListAction());
        this.listComponent.moveItemToEditMode(createdFolder);
      }
    });


    this._uploadFileButton = new Button(buttonContainer, {
      type: 'button',
      textContent: 'Upload File',
      title: 'Upload File',
      glyphiconClass: 'glyphicon-upload',
      isLoading: true,
    });

    this._uploadFileButton.addClickHandler(() => {
      const {stateManager, selectFileService} = this.properties;
      const uploadFileAction = new UploadFileAction(stateManager.state.folder, selectFileService);
      this.dispatch(uploadFileAction);
    });

    this.logOutAnchor = rootElement.querySelector('[data-type="log-out-anchor"]');
    this.logOutAnchor.addEventListener('click', () => this.dispatch(new LogOutAction()));

    const listContainer = rootElement.querySelector('[data-type="file-list-container"]');
    this.listComponent = new FileList(listContainer);

    this.listComponent.onFolderComponentDoubleClick((folderId) => {
      this._executeRedirectToFolderCallbacks(folderId);
    });

    this.listComponent.onRemoveListItem((listItem) => this.dispatch(new RemoveListItemAction(listItem)));
    this.listComponent.onUpdateListItem((listItem) => this.dispatch(new RenameListItemAction(listItem)));
    this.listComponent.onUploadStart((folder) => {
      this.dispatch(new UploadFileAction(folder, this.properties.selectFileService));
    });
    this.listComponent.onDownloadFileStart((file) => {
      this.dispatch(new GetFileContentAction(file, this.properties.fileDownloader));
    });
  }

  /**
   * @inheritdoc
   */
  initState() {
    const {listComponent, breadcrumbsComponent, _createFolderButton, _userDetails, _uploadFileButton} = this;

    this.onStateChanged('listItems', (state) => {
      listComponent.listItems = state.listItems;
    });

    this.onStateChanged('isListItemsLoading', (state) => {
      this._isFolderContentLoading(state.isListItemsLoading);
    });

    this.onStateChanged('listItemsLoadingError', (state) => {
      const error = state.listItemsLoadingError;
      const {toastService} = this.properties;

      if (error instanceof AuthenticationError) {
        toastService.showError(error.message);
        this._handleAuthenticationError();
      } else if (error instanceof ResourceNotFoundError) {
        toastService.showError(error.message);
        this._handleResourceNotFoundError('Folder', '/folder');
      } else if (error instanceof GeneralServerError) {
        toastService.showError('Cannot retrieve items list from server.');
      }
    });

    this.onStateChanged('folder', (state) => {
      const {name, parentId, id} = state.folder;
      breadcrumbsComponent.renderTrail(name, parentId);
      _createFolderButton.isLoading = state.parentFoldersCreatingInProgress
        .some((folder) => folder.id === id);
      _uploadFileButton.isLoading = state.parentFoldersOfUploadingFiles.some((folder) => folder.id === id);
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
        await this.dispatch(new GetUserAction());
        await this.dispatch(new GetFolderAction(folderId));
        await this.dispatch(new RefreshListAction());
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

    this.onStateChanged('listItemsToDelete', (state) => {
      listComponent.listItemsToDelete = state.listItemsToDelete;
    });

    this.onStateChanged('deletionIssue', (state) => {
      const {itemDeletionError, notDeletedItem} = state.deletionIssue;
      const {toastService} = this.properties;

      if (itemDeletionError instanceof AuthenticationError) {
        toastService.showError('Please log in.');
        this._handleAuthenticationError();
      } else if (itemDeletionError instanceof ResourceNotFoundError) {
        toastService.showError(`List item ${notDeletedItem.name} was not found.`);

        if (notDeletedItem.parentId === state.folder.id) {
          this.dispatch(new RefreshListAction());
        }

      } else if (itemDeletionError instanceof GeneralServerError) {
        toastService.showError(`List item with name ${notDeletedItem.name} wasn't deleted.`);
      }
    });

    this.onStateChanged('renamingListItems', (state) => {
      listComponent.renamingListItems = state.renamingListItems;
    });

    this.onStateChanged('renamingIssue', (state) => {
      const {itemRenamingError, notRenamedItem} = state.renamingIssue;
      const {toastService} = this.properties;

      if (itemRenamingError instanceof AuthenticationError) {
        toastService.showError('Please log in.');
        this._handleAuthenticationError();
      } else if (itemRenamingError instanceof ResourceNotFoundError) {
        toastService.showError(`List item ${notRenamedItem.name} was not found.`);

        if (notRenamedItem.parentId === state.folder.id) {
          this.dispatch(new RefreshListAction());
        }

      } else if (itemRenamingError instanceof GeneralServerError) {
        toastService.showError(`List item with name ${notRenamedItem.name} wasn't renamed.`);
      }
    });

    this.onStateChanged('parentFoldersCreatingInProgress', (state) => {
      const {parentFoldersCreatingInProgress, folder} = state;
      _createFolderButton.isLoading = parentFoldersCreatingInProgress.some((parent) => parent.id === folder.id);
    });

    this.onStateChanged('folderCreatingError', (state) => {
      const {folderCreatingError} = state;
      const {toastService} = this.properties;

      if (folderCreatingError instanceof AuthenticationError) {
        toastService.showError('Please log in.');
        this._handleAuthenticationError();
      } else if (folderCreatingError instanceof ResourceNotFoundError) {
        toastService.showError(folderCreatingError.message);
        this._handleResourceNotFoundError('Parent folder', '/folder');
      } else if (folderCreatingError instanceof GeneralServerError) {
        toastService.showError('Cannot create folder.');
      }
    });

    this.onStateChanged('currentUser', (state) => {
      _userDetails.userName = state.currentUser.name;
    });

    this.onStateChanged('isUserLoading', (state) => {
      _userDetails.isLoading = state.isUserLoading;
    });

    this.onStateChanged('userLoadingError', (state) => {
      _userDetails.isError = !!state.userLoadingError;
    });

    this.onStateChanged('parentFoldersOfUploadingFiles', (state) => {
      const {parentFoldersOfUploadingFiles, folder} = state;
      _uploadFileButton.isLoading = parentFoldersOfUploadingFiles.some((parent) => parent.id === folder.id);
      listComponent.parentFoldersOfUploadingFiles = parentFoldersOfUploadingFiles;
    });

    this.onStateChanged('uploadingFileIssue', (state) => {
      const {error, notUploadedFileName, parentFolder} = state.uploadingFileIssue;
      const {toastService} = this.properties;

      if (error instanceof AuthenticationError) {
        toastService.showError('Please log in.');
        this._handleAuthenticationError();
      } else if (error instanceof ResourceNotFoundError) {
        toastService.showError(`Parent folder ${parentFolder.name} was not found.`);

        if (parentFolder.id === state.folder.id) {
          this.dispatch(new RefreshListAction());
        }
      } else if (error instanceof GeneralServerError) {
        toastService.showError(`File ${notUploadedFileName} wasn't uploaded.`);
      }
    });

    this.onStateChanged('downloadingFiles', (state) => {
      listComponent.downloadingFileModels = state.downloadingFiles;
    });

    this.onStateChanged('downloadingFileIssue', (state) => {
      const {folder, downloadingFileIssue} = state;
      const {error, file} = downloadingFileIssue;
      const {toastService} = this.properties;

      if (error instanceof AuthenticationError) {
        toastService.showError('Please log in.');
        this._handleAuthenticationError();
      } else if (error instanceof ResourceNotFoundError) {
        toastService.showError(`File ${file.name} was not found.`);

        if (folder.id === file.parentId) {
          this.dispatch(new RefreshListAction());
        }

      } else if (error instanceof GeneralServerError) {
        toastService.showError(`File ${file.name} wasn't downloaded.`);
      }
    });
  }

  /**
   * Sets folder-content-loading value.
   *
   * @param {boolean} isLoading - is folder content loading or not.
   * @private
   */
  _isFolderContentLoading(isLoading) {
    const classList = this.rootElement.querySelector('[data-type="folder-content-loader"]').classList;
    const loaderClass = 'folder-content-loader';

    if (isLoading) {
      classList.add(loaderClass);
    } else {
      classList.remove(loaderClass);
    }
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
