import Mutator from './mutator.js';

/**
 * Applies renaming item error to state.
 */
export default class RenamingItemErrorMutator extends Mutator {

  /**
   * Error to set to state.
   * @type {Error}.
   * @private
   */
  _error;

  /**
   * List item that failed to rename.
   * @type {ListItemModel}
   * @private
   */
  _listItem;

  /**
   * Instantiates RenamingItemErrorMutator.
   *
   * @param {Error} error - renaming item error.
   * @param {ListItemModel} listItem - not renamed list item.
   */
  constructor(error, listItem) {
    super();
    this._error = error;
    this._listItem = listItem;
  }

  /**
   * @inheritdoc
   */
  apply(state) {
    state.renamingIssue = {
      itemRenamingError: this._error,
      notRenamedItem: this._listItem,
    };
  }
}
