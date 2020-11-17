import Mutator from './mutator.js';

/**
 * Applies user to state.
 */
export default class UserLoadingMutator extends Mutator {

  /**
   * Instantiates UserLoadingMutator.
   *
   * @param {boolean} isLoading - says whether user data is loading or not.
   */
  constructor(isLoading) {
    super();
    this._isLoading = isLoading;
  }

  /**
   * @inheritdoc
   */
  apply(state) {
    state.isUserLoading = this._isLoading;
  }
}
