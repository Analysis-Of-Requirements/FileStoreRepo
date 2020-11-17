import Mutator from './mutator.js';

/**
 * Deletes renaming list item from state.
 */
export default class RemoveFromRenamingInProgressMutator extends Mutator {

  /**
   * List Item to remove from renaming list.
   * @type {ListItemModel}.
   * @private
   */
  _listItem;

  /**
   * Instantiates RemoveFromRenamingInProgressMutator.
   *
   * @param {ListItemModel} listItem - list item to remove from renaming list.
   */
  constructor(listItem) {
    super();
    this._listItem = listItem;
  }

  /**
   * @inheritdoc
   */
  apply(state) {
    state.renamingListItems = state.renamingListItems.filter((item) => item.id !== this._listItem.id);
  }
}
