import Mutator from './mutator.js';

/**
 * Mutator sets error, which occurred during downloading of file.
 */
export default class FileDownloadingIssueMutator extends Mutator {

  /**
   * Instantiates FileDownloadingIssueMutator.
   *
   * @param {Error} error - error.
   * @param {FileModel} file - model of not downloaded file.
   */
  constructor(error, file) {
    super();
    this._error = error;
    this._file = file;
  }

  /**
   * @inheritdoc
   */
  apply(state) {
    state.downloadingFileIssue = {
      error: this._error,
      file: this._file,
    };
  }
}
