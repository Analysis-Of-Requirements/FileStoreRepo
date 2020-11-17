import Mutator from './mutator.js';

/**
 * Deletes downloading file from state.
 */
export default class RemoveFileFromDownloadingInProgressMutator extends Mutator {

  /**
   * Instantiates RemoveFileFromDownloadingInProgressMutator.
   *
   * @param {FileModel} file - file that should be deleted from downloading list..
   */
  constructor(file) {
    super();
    this._file = file;
  }

  /**
   * @inheritdoc
   */
  apply(state) {
    state.downloadingFiles = state.downloadingFiles.filter((item) => item.id !== this._file.id);
  }
}
