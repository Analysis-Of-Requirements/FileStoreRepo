import Action from './action.js';
import GetFolderContentAction from './get-folder-content-action.js';

/**
 * Actions initiates refreshing list with new items.
 */
export default class RefreshListAction extends Action {

  /**
   * @inheritdoc
   */
  async apply(stateManager) {
    const folderId = stateManager._state.locationParams.folderId;
    const action = new GetFolderContentAction(folderId);

    return stateManager.dispatchAction(action);
  }
}
