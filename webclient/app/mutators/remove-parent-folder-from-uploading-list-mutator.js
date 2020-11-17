import Mutator from './mutator.js';

/**
 * Deletes folder from list of folders that have their files uploading.
 */
export default class RemoveParentFolderFromUploadingListMutator extends Mutator {

  /**
   * Instantiates RemoveParentFolderFromUploadingListMutator.
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
    state.parentFoldersOfUploadingFiles = state.parentFoldersOfUploadingFiles
      .filter((item) => item.id !== this._folder.id);
  }
}
