import Action from './action.js';
import AddParentFolderToCreatingInProgressMutator
  from '../mutators/add-parent-folder-to-creating-in-progress-mutator.js';
import FolderCreatingErrorMutator from '../mutators/folder-creating-error-mutator.js';
import RemoveParentFolderFromCreatingInProgressMutator
  from '../mutators/remove-parent-folder-from-creating-in-progress-mutator.js';
import FolderModel from '../models/folder-model.js';

/**
 * Actions initiates creating folder.
 */
export default class CreateFolderAction extends Action {

  /**
   * Instantiates CreateFolderAction.
   *
   * @param {FolderModel} parentFolder - parent folder where item creating takes place.
   */
  constructor(parentFolder) {
    super();
    this._parentFolder = parentFolder;
  }

  /**
   * @inheritdoc
   *
   * @return {Promise<FolderModel>} folder model object.
   */
  async apply(stateManager) {
    stateManager.mutate(new AddParentFolderToCreatingInProgressMutator(this._parentFolder));

    return stateManager.apiService.createFolder(this._parentFolder.id)
      .then((folderObject) => new FolderModel(folderObject))
      .catch((error) => stateManager.mutate(new FolderCreatingErrorMutator(error)))
      .finally((folder) => {
        stateManager.mutate(new RemoveParentFolderFromCreatingInProgressMutator(this._parentFolder));

        return folder;
      });
  }
}
