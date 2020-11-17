import Mutator from './mutator.js';

/**
 * Applies loading error state.
 */
export default class ListItemsLoadingErrorMutator extends Mutator {

  /**
   * Error to set to state.
   * @type {Error}.
   * @private
   */
  _error;

  /**
   * Instantiates mutator.
   *
   * @param {Error} error - error.
   */
  constructor(error) {
    super();
    this._error = error;
  }

  /**
   * @inheritdoc
   */
  apply(state) {
    state.listItemsLoadingError = this._error;
  }
}
