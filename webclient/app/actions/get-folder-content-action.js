import Action from './action.js';
import ListItemsLoadingMutator from '../mutators/list-items-loading-mutator.js';
import ListItemsMutator from '../mutators/list-items-mutator.js';
import ListItemsLoadingErrorMutator from '../mutators/list-items-loading-error-mutator.js';

/**
 * Action for retrieving data from the server.
 */
export default class GetFolderContentAction extends Action {

  /**
   * Id of folder to pass to ApiService.
   * @type {object}.
   * @private
   */
  _folderId;

  /**
   * @inheritdoc
   * @param {string} folderId - id of folder to request in ApiService.
   */
  constructor(folderId) {
    super();
    this._folderId = folderId;
  }

  /**
   * Applies action to retrieve data from the server.
   * @inheritdoc
   * @param {StateManager} stateManager - state manager with target state.
   */
  async apply(stateManager) {
    const mutator = new ListItemsLoadingMutator(true);
    stateManager.mutate(mutator);

    return stateManager.apiService.getFolderContent(this._folderId)
      .then((response) => {
        const mutator = new ListItemsMutator(response.listItems);
        stateManager.mutate(mutator);
      })
      .catch((error) => {
        const mutator = new ListItemsLoadingErrorMutator(error);
        stateManager.mutate(mutator);
      })
      .finally(() => {
        const mutator = new ListItemsLoadingMutator(false);
        stateManager.mutate(mutator);
      });
  }
}
