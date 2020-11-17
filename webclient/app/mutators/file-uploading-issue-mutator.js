import Mutator from './mutator.js';

/**
 * Mutator sets error, which occurred during uploading of file.
 */
export default class FileUploadingIssueMutator extends Mutator {

  /**
   * Instantiates ItemDeletionIssueMutator.
   *
   * @param {Error} error - error.
   * @param {string} fileName - name of file that was not uploaded.
   * @param {FolderModel} parentFolder - not found parent folder.
   */
  constructor(error, fileName, parentFolder) {
    super();
    this._error = error;
    this._fileName = fileName;
    this._parentFolder = parentFolder;
  }

  /**
   * @inheritdoc
   */
  apply(state) {
    state.uploadingFileIssue = {
      error: this._error,
      notUploadedFileName: this._fileName,
      parentFolder: this._parentFolder,
    };
  }
}
