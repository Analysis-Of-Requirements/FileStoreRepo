import Mutator from './mutator.js';

/**
 * Mutator sets error, which occurred during deletion of list item.
 */
export default class ItemDeletionIssueMutator extends Mutator {

  /**
   * Error to set to state.
   * @type {Error}
   * @private
   */
  _error;

  /**
   * Item that wasn't deleted.
   * @type {ListItemModel}
   * @private
   */
  _notDeletedItem;

  /**
   * Instantiates ItemDeletionIssueMutator.
   *
   * @param {Error} error - error.
   * @param {ListItemModel} notDeletedItem - list item model that wasn't deleted.
   */
  constructor(error, notDeletedItem) {
    super();
    this._error = error;
    this._notDeletedItem = notDeletedItem;
  }

  /**
   * @inheritdoc
   */
  apply(state) {
    state.deletionIssue = {
      itemDeletionError: this._error,
      notDeletedItem: this._notDeletedItem,
    };
  }
}
