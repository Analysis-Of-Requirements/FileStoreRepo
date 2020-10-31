import Action from './action.js';
import FolderLoadingMutator from '../mutators/folder-loading-mutator.js';
import RootFolderMutator from '../mutators/root-folder-mutator.js';
import RootFolderLoadingErrorMutator from '../mutators/root-folder-loading-error-mutator.js';

/**
 * Makes request to retrieve root folder from server.
 */
export default class GetRootFolderAction extends Action {

  /**
   * @inheritdoc
   */
  async apply(stateManager) {
    const mutator = new FolderLoadingMutator(true);
    stateManager.mutate(mutator);

    return stateManager.apiService.getRootFolder()
        .then((folderResponseJson) => {
          const mutator = new RootFolderMutator(folderResponseJson);
          stateManager.mutate(mutator);
        })
        .catch((error) => {
          const mutator = new RootFolderLoadingErrorMutator(error);
          stateManager.mutate(mutator);
        })
        .finally(() => {
          const mutator = new FolderLoadingMutator(false);
          stateManager.mutate(mutator);
        });
  }
}
