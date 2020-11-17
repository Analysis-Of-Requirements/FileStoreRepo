import Action from './action.js';
import AddFileToDownloadingInProgressMutator from '../mutators/add-file-to-downloading-in-progress-mutator.js';
import FileDownloadingIssueMutator from '../mutators/file-downloading-issue-mutator.js';
import RemoveFileFromDownloadingInProgressMutator
  from '../mutators/remove-file-from-downloading-in-progress-mutator.js';

/**
 * Action initiates loading file content from server.
 */
export default class GetFileContentAction extends Action {

  /**
   * Instantiates GetFileContentAction.
   *
   * @param {FileModel} fileModel - file model, which is mapped to a specific file.
   * @param {BrowserFileDownloader} fileDownloader - service for downloading file to user's files system.
   */
  constructor(fileModel, fileDownloader) {
    super();
    this._fileModel = fileModel;
    this._fileDownloader = fileDownloader;
  }

  /**
   * @inheritdoc
   */
  async apply(stateManager) {
    const {_fileModel, _fileDownloader} = this;

    stateManager.mutate(new AddFileToDownloadingInProgressMutator(_fileModel));

    return stateManager.apiService.getFileContent(_fileModel.id)
      .then((blob) => this._constructFile(blob, _fileModel))
      .then((file) => _fileDownloader.downloadFile(file))
      .catch((error) => stateManager.mutate(new FileDownloadingIssueMutator(error, _fileModel)))
      .finally(() => stateManager.mutate(new RemoveFileFromDownloadingInProgressMutator(_fileModel)));
  }

  /**
   * Constructs File from passed Blob.
   *
   * @param {Blob} blob - file content.
   * @param {FileModel} fileModel - model, containing descriptive info about file.
   * @return {Promise<File>} - constructed file.
   * @private
   */
  async _constructFile(blob, fileModel) {
    return new File([blob], fileModel.name, {
      type: blob.type,
    });
  }
}
