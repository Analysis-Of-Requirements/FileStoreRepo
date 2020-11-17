import Action from './action.js';
import AddToDeletionInProgressMutator from '../mutators/add-to-deletion-in-progress-mutator.js';
import RemoveFromDeletionInProgressMutator from '../mutators/remove-from-deletion-in-progress-mutator.js';
import ItemDeletionIssueMutator from '../mutators/item-deletion-issue-mutator.js';
import RefreshListAction from './refresh-list-action.js';

/**
 * Action intended to remove list item of type {folder | file}.
 */
export default class RemoveListItemAction extends Action {

  /**
   * List Item model to delete.
   * @type {ListItemModel}
   */
  _listItem;

  /**
   * @inheritdoc
   * @param {ListItemModel} listItem - list item to remove.
   */
  constructor(listItem) {
    super();
    this._listItem = listItem;
  }

  /**
   * @inheritdoc
   */
  async apply(stateManager) {
    const {_listItem} = this;
    stateManager.mutate(new AddToDeletionInProgressMutator(_listItem));

    return stateManager.apiService.deleteListItem(_listItem)
      .then(() => stateManager.dispatchAction(new RefreshListAction()))
      .catch((error) => stateManager.mutate(new ItemDeletionIssueMutator(error, _listItem)))
      .finally(() => stateManager.mutate(new RemoveFromDeletionInProgressMutator(_listItem)));
  }
}
