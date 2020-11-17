import Mutator from './mutator.js';

/**
 * Applies user loading error state.
 */
export default class UserLoadingErrorMutator extends Mutator {

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
    state.userLoadingError = this._error;
  }
}
