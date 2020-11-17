import Mutator from './mutator.js';

/**
 * Mutator adds item to list items to delete.
 */
export default class AddToDeletionInProgressMutator extends Mutator {

  /**
   * List Item model to delete.
   * @type {ListItemModel}
   */
  _listItem;

  /**
   * Instantiates AddListItemToDeleteMutator.
   *
   * @param {ListItemModel} listItem - list item to delete.
   */
  constructor(listItem) {
    super();
    this._listItem = listItem;
  }

  /**
   * @inheritdoc
   */
  apply(state) {
    state.listItemsToDelete = [...state.listItemsToDelete, this._listItem];
  }
}
