import Mutator from './mutator.js';

/**
 * Applies folder loading error to state.
 */
export default class FolderLoadingErrorMutator extends Mutator {

  /**
   * Error to set to state.
   * @type {Error}.
   * @private
   */
  _error;

  /**
   * Instantiates FolderLoadingErrorMutator.
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
    state.folderLoadingError = this._error;
  }
}
