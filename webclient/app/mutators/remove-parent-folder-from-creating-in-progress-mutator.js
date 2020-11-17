import Mutator from './mutator.js';

/**
 * Removes parent folder, that has child folder creating, from state.
 */
export default class RemoveParentFolderFromCreatingInProgressMutator extends Mutator {

  /**
   * Parent folder.
   * @type {FolderModel}.
   * @private
   */
  _parentFolder;

  /**
   * Instantiates RemoveParentFolderFromCreatingInProgressMutator.
   *
   * @param {FolderModel} folder - parent folder.
   */
  constructor(folder) {
    super();
    this._parentFolder = folder;
  }

  /**
   * @inheritdoc
   */
  apply(state) {
    state.parentFoldersCreatingInProgress = state.parentFoldersCreatingInProgress
      .filter((item) => item.id !== this._parentFolder.id);
  }
}
