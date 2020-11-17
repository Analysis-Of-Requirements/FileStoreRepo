import Mutator from './mutator.js';

/**
 * Applies renaming list item to state.
 */
export default class AddToRenamingInProgressMutator extends Mutator {

  /**
   * List Item to rename.
   * @type {ListItemModel}.
   * @private
   */
  _listItem;

  /**
   * Instantiates AddToRenamingInProgressMutator.
   *
   * @param {ListItemModel} listItem - list item to rename.
   */
  constructor(listItem) {
    super();
    this._listItem = listItem;
  }

  /**
   * @inheritdoc
   */
  apply(state) {
    state.renamingListItems = [...state.renamingListItems, this._listItem];
  }
}
