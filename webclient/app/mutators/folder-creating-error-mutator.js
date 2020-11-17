import Mutator from './mutator.js';

/**
 * Applies folder occurred while creating folder.
 */
export default class FolderCreatingErrorMutator extends Mutator {

  /**
   * Error to set to state.
   * @type {Error}.
   * @private
   */
  _error;

  /**
   * Instantiates FolderCreatingErrorMutator.
   * @param {Error} error - folder loading error.
   */
  constructor(error) {
    super();
    this._error = error;
  }

  /**
   * @inheritdoc
   */
  apply(state) {
    state.folderCreatingError = this._error;
  }
}
