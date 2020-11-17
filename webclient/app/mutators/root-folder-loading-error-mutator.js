import Mutator from './mutator.js';

/**
 * Applies folder loading error to state.
 */
export default class RootFolderLoadingErrorMutator extends Mutator {

  /**
   * Error to set to state.
   * @type {Error}.
   * @private
   */
  _error;

  /**
   * Instantiates RootFolderLoadingErrorMutator.
   * @param {Error} error - root folder loading error.
   */
  constructor(error) {
    super();
    this._error = error;
  }

  /**
   * @inheritdoc
   */
  apply(state) {
    state.rootFolderLoadingError = this._error;
  }
}
