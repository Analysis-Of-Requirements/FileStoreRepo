import Action from './action.js';
import AddParentFolderToUploadingListMutator from '../mutators/add-parent-folder-to-uploading-list-mutator.js';
import RemoveParentFolderFromUploadingListMutator
  from '../mutators/remove-parent-folder-from-uploading-list-mutator.js';
import FileUploadingIssueMutator from '../mutators/file-uploading-issue-mutator.js';
import SelectFileService from '../services/select-file-service.js';
import RefreshListAction from './refresh-list-action.js';

/**
 * Action is aimed to delegate uploading file on server.
 */
export default class UploadFileAction extends Action {

  /**
   * Creates instance of UploadFileAction.
   *
   * @param {FolderModel} parentFolder - parent folder of the file.
   * @param {SelectFileService} selectFileService - service for selecting file from file system.
   */
  constructor(parentFolder, selectFileService) {
    super();
    this._parentFolder = parentFolder;
    this._selectFileService = selectFileService;
  }

  /**
   * Applies action of uploading file to server.
   * @inheritdoc
   */
  async apply(stateManager) {
    const {_parentFolder} = this;
    const file = await this._selectFileService.selectFile();
    stateManager.mutate(new AddParentFolderToUploadingListMutator(_parentFolder));

    try {
      await stateManager.apiService.uploadFile(_parentFolder, file);

      if (_parentFolder.id === stateManager.state.folder.id) {
        await stateManager.dispatchAction(new RefreshListAction());
      }
    } catch (error) {
      stateManager.mutate(new FileUploadingIssueMutator(error, file.name, _parentFolder));
    } finally {
      stateManager.mutate(new RemoveParentFolderFromUploadingListMutator(_parentFolder));
    }
  }
}
