/**
 * State of List Explorer.
 */
export default class State {

  /**
   * List of items.
   * @type {ListItemModel[]}
   */
  listItems;

  /**
   * Error that occurred while loading list of items.
   * @type {Error}
   */
  listItemsLoadingError;

  /**
   * Is list items in progress or not.
   * @type {boolean}
   */
  isListItemsLoading;

  /**
   * Static part of the url.
   * @type {string}
   */
  location;

  /**
   * Dynamic part of the url.
   * @type {object}
   */
  locationParams;

  /**
   * Current folder.
   * @type {FolderModel}
   */
  folder;

  /**
   * Error that occurred while loading folder.
   * @type {Error}
   */
  folderLoadingError;

  /**
   * Is folder loading in progress or not.
   * @type {boolean}
   */
  isFolderLoading;

  /**
   * Root folder data.
   * @type {FolderModel}
   */
  rootFolder;

  /**
   * Error that occurred while loading root folder.
   * @type {Error}.
   */
  rootFolderLoadingError;

  /**
   * ListItemsToDelete
   * @type {ListItemModel[]}
   */
  listItemsToDelete = [];

  /**
   * Contains error, describing reason why item wasn't deleted after corresponding request.
   * @type {{itemDeletionError: Error}, {notDeletedItem: ListItemModel}}
   */
  deletionIssue = {
    itemDeletionError: null,
    notDeletedItem: null,
  };

  /**
   * Currently renaming list items.
   * @type {ListItemModel[]}
   */
  renamingListItems = [];

  /**
   * Contains error, describing reason why item wasn't renamed after corresponding request.
   * @type {{itemRenamingError: Error}, {notDeletedItem: notRenamedItem}}
   */
  renamingIssue = {
    itemRenamingError: null,
    notRenamedItem: null,
  };

  /**
   * Parent Folders that are in chile-folder-creating state.
   * @type {FolderModel[]}
   */
  parentFoldersCreatingInProgress = [];

  /**
   * Folder creating error.
   * @type {Error}
   */
  folderCreatingError;

  /**
   * Defines whether user started loading or not.
   * @type {boolean}
   */
  isUserLoading;

  /**
   * Current user data.
   * @type {UserModel}
   */
  currentUser;

  /**
   * Error, that occurred while loading user data.
   * @type {Error}
   */
  userLoadingError;

  /**
   * Folders that have files uploading at the moment.
   * @type {FolderModel[]}
   */
  parentFoldersOfUploadingFiles = [];

  /**
   * Contains error, describing reason why file wasn't uploaded.
   * @type {{notUploadedFileName: string, error: Error, parentFolder: FolderModel}}
   */
  uploadingFileIssue;

  /**
   * Files that are currently downloading.
   * @type {FileModel[]}
   */
  downloadingFiles = [];

  /**
   * Contains error, describing reason why file wasn't downloaded.
   * @type {{file: FileModel, error: Error}}
   */
  downloadingFileIssue;
}
