import Action from './action.js';
import AddToRenamingInProgressMutator from '../mutators/add-to-renaming-in-progress-mutator.js';
import RemoveFromRenamingInProgressMutator from '../mutators/remove-from-renaming-in-progress-mutator.js';
import RenamingItemErrorMutator from '../mutators/renaming-item-error-mutator.js';
import RefreshListAction from './refresh-list-action.js';

/**
 * Action aimed to update list item content.
 */
export default class RenameListItemAction extends Action {

  /**
   * Instantiates UpdateListItemAction.
   * @type {ListItemModel}
   */
  _listItem;

  /**
   * @inheritdoc
   * @param {ListItemModel} listItem - list item to update.
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

    stateManager.mutate(new AddToRenamingInProgressMutator(_listItem));

    return stateManager.apiService.updateListItem(_listItem)
      .then(() => stateManager.dispatchAction(new RefreshListAction()))
      .catch((error) => stateManager.mutate(new RenamingItemErrorMutator(error, _listItem)))
      .finally(() => stateManager.mutate(new RemoveFromRenamingInProgressMutator(_listItem)));
  }
}
