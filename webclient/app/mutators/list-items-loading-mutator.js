import Mutator from './mutator.js';

/**
 * Applies list items loading value to state.
 */
export default class ListItemsLoadingMutator extends Mutator {

  /**
   * Defines state of loading list items.
   * @type {boolean}.
   * @private
   */
  _isLoading;

  /**
   * Instantiates ListItemsLoadingMutator.
   *
   * @param {boolean} isLoading - says whether state started loading or not.
   */
  constructor(isLoading) {
    super();
    this._isLoading = isLoading;
  }

  /**
   * @inheritdoc
   */
  apply(state) {
    state.isListItemsLoading = this._isLoading;
  }
}
