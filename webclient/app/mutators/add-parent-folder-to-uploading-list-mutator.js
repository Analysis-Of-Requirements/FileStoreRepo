import Mutator from './mutator.js';

/**
 * Applies folder to list of folders that have uploading files.
 */
export default class AddParentFolderToUploadingListMutator extends Mutator {

  /**
   * Instantiates AddParentFolderToUploadingListMutator.
   *
   * @param {FolderModel} folder - folder to add.
   */
  constructor(folder) {
    super();
    this._folder = folder;
  }

  /**
   * @inheritdoc
   */
  apply(state) {
    state.parentFoldersOfUploadingFiles = [...state.parentFoldersOfUploadingFiles, this._folder];
  }
}
