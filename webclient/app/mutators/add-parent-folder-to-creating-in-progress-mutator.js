import Mutator from './mutator.js';

/**
 * Applies to parent folder creating in progress state.
 */
export default class AddParentFolderToCreatingInProgressMutator extends Mutator {

  /**
   * Parent folder.
   * @type {FolderModel}.
   * @private
   */
  _parentFolder;

  /**
   * Instantiates AddParentFolderToCreatingInProgressMutator.
   *
   * @param {FolderModel} parentFolder - parentFolder.
   */
  constructor(parentFolder) {
    super();
    this._parentFolder = parentFolder;
  }

  /**
   * @inheritdoc
   */
  apply(state) {
    state.parentFoldersCreatingInProgress = [...state.parentFoldersCreatingInProgress, this._parentFolder];
  }
}
