import Mutator from './mutator.js';

/**
 * Mutator removes item from list items to delete.
 */
export default class RemoveFromDeletionInProgressMutator extends Mutator {

  /**
   * List Item model to remove from list.
   * @type {ListItemModel}
   */
  _listItem;

  /**
   * Instantiates RemoveItemFromListItemToDeleteMutator.
   *
   * @param {ListItemModel} listItem - list item to remove from list.
   */
  constructor(listItem) {
    super();
    this._listItem = listItem;
  }

  /**
   * @inheritdoc
   */
  apply(state) {
    state.listItemsToDelete = state.listItemsToDelete.filter((item) => item.id !== this._listItem.id);
  }
}
