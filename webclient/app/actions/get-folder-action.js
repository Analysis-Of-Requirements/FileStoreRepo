import Action from './action.js';
import FolderMutator from '../mutators/folder-mutator.js';
import FolderLoadingMutator from '../mutators/folder-loading-mutator.js';
import FolderLoadingErrorMutator from '../mutators/folder-loading-error-mutator.js';

/**
 * Action for retrieving data from the server.
 */
export default class GetFolderAction extends Action {

  /**
   * Id of folder to pass to ApiService.
   * @type {string}.
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
   * @param {StateManager} stateManager - state manager with target
   */
  async apply(stateManager) {
    const mutator = new FolderLoadingMutator(true);
    stateManager.mutate(mutator);

    return stateManager.apiService.getFolder(this._folderId)
      .then((folderResponseJson) => {
        const mutator = new FolderMutator(folderResponseJson);
        stateManager.mutate(mutator);
      })
      .catch((error) => {
        const mutator = new FolderLoadingErrorMutator(error);
        stateManager.mutate(mutator);
      })
      .finally(() => {
        const mutator = new FolderLoadingMutator(false);
        stateManager.mutate(mutator);
      });
  }
}
