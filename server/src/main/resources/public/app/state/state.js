/**
 * State of List Explorer.
 */
export default class State {

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
}
