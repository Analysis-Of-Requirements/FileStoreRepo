import Mutator from './mutator.js';

/**
 * Applies downloading file in progress to state.
 */
export default class AddFileToDownloadingInProgressMutator extends Mutator {

  /**
   * Instantiates AddToRenamingInProgressMutator.
   *
   * @param {FileModel} fileModel - list item to rename.
   */
  constructor(fileModel) {
    super();
    this._file = fileModel;
  }

  /**
   * @inheritdoc
   */
  apply(state) {
    state.downloadingFiles = [...state.downloadingFiles, this._file];
  }
}
