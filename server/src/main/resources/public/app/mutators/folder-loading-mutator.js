import Mutator from './mutator.js';

/**
 * Applies loading state for folder meta data.
 */
export default class FolderLoadingMutator extends Mutator {

  /**
   * Defines state of loading folder.
   * @type {boolean}.
   * @private
   */
  _isLoading;

  /**
   * Instantiates FolderLoadingMutator.
   *
   * @param {boolean} isLoading - says whether folder started loading or not.
   */
  constructor(isLoading) {
    super();
    this._isLoading = isLoading;
  }

  /**
   * @inheritdoc
   */
  apply(state) {
    state.isFolderLoading = this._isLoading;
  }
}
