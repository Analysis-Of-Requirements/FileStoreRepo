import RefreshListAction from '../../../app/actions/refresh-list-action.js';
import AddParentFolderToUploadingListMutator
  from '../../../app/mutators/add-parent-folder-to-uploading-list-mutator.js';
import RemoveParentFolderFromUploadingListMutator
  from '../../../app/mutators/remove-parent-folder-from-uploading-list-mutator.js';
import UploadFileAction from '../../../app/actions/upload-file-action.js';
import FileUploadingIssueMutator from '../../../app/mutators/file-uploading-issue-mutator.js';

const {module, test} = QUnit;

export default module('Upload File Action', () => {

  test('should correctly handle successful file uploading.', async (assert) => {
    assert.expect(9);

    const folder = {
      id: 'mock-id',
    };
    const stateManager = {
      apiService: {
        async uploadFile(parentFolder, file) {
          assert.step(`Should call ApiService.uploadFile() with passed folder: ${parentFolder.id} and file: ${file.name}.`);
        },
      },

      dispatchAction(action) {
        assert.step(`Dispatched action: ${action.constructor.name}.`);

        if (action instanceof RefreshListAction) {
          assert.step('Refreshed List Action is called.');
        }
      },

      mutate(mutator) {
        assert.step(`Called mutator: ${mutator.constructor.name}.`);

        if (mutator instanceof AddParentFolderToUploadingListMutator) {
          assert.step(`${mutator.constructor.name}.folder.id: ${mutator._folder.id}.`);
        } else if (mutator instanceof RemoveParentFolderFromUploadingListMutator) {
          assert.step(`${mutator.constructor.name}.folder.id: ${mutator._folder.id}.`);
        }
      },

      state: {
        folder,
      },
    };

    const fileName = 'mock-name';
    const selectFileService = {
      async selectFile() {
        assert.step('Should select file.');
        return new File([], fileName);
      },
    };

    const action = new UploadFileAction(folder, selectFileService);
    await action.apply(stateManager);

    assert.verifySteps([
      'Should select file.',
      `Called mutator: ${AddParentFolderToUploadingListMutator.name}.`,
      `${AddParentFolderToUploadingListMutator.name}.folder.id: ${folder.id}.`,
      `Should call ApiService.uploadFile() with passed folder: ${folder.id} and file: ${fileName}.`,
      `Dispatched action: ${RefreshListAction.name}.`,
      'Refreshed List Action is called.',
      `Called mutator: ${RemoveParentFolderFromUploadingListMutator.name}.`,
      `${RemoveParentFolderFromUploadingListMutator.name}.folder.id: ${folder.id}.`,
    ], 'All expected methods should be called in correct order.');
  });

  test('should correctly handle failed uploading', async (assert) => {
    assert.expect(11);

    const errorMessage = 'error-message-mock';
    const stateManager = {
      apiService: {
        async uploadFile(parentFolder, file) {
          assert.step(`Should call ApiService.uploadFile() with passed folder: ${parentFolder.id} and file: ${file.name}.`);
          throw new Error(errorMessage);
        },
      },

      mutate(mutator) {
        assert.step(`Called mutator: ${mutator.constructor.name}.`);

        if (mutator instanceof AddParentFolderToUploadingListMutator) {
          assert.step(`${mutator.constructor.name}.folder.id: ${mutator._folder.id}.`);
        } else if (mutator instanceof RemoveParentFolderFromUploadingListMutator) {
          assert.step(`${mutator.constructor.name}.folder.id: ${mutator._folder.id}.`);
        } else if (mutator instanceof FileUploadingIssueMutator) {
          assert.step(`error.message: ${mutator._error.message}.`);
          assert.step(`erroneous file name: ${mutator._fileName}.`);
          assert.step(`erroneous parent folder id: ${mutator._parentFolder.id}.`);
        }
      },
    };

    const folder = {
      id: 'mock-id',
    };
    const fileName = 'mock-name';
    const selectFileService = {
      async selectFile() {
        assert.step('Should select file.');
        return new File([], fileName);
      },
    };

    const action = new UploadFileAction(folder, selectFileService);
    await action.apply(stateManager);

    assert.verifySteps([
      'Should select file.',
      `Called mutator: ${AddParentFolderToUploadingListMutator.name}.`,
      `${AddParentFolderToUploadingListMutator.name}.folder.id: ${folder.id}.`,
      `Should call ApiService.uploadFile() with passed folder: ${folder.id} and file: ${fileName}.`,
      `Called mutator: ${FileUploadingIssueMutator.name}.`,
      `error.message: ${errorMessage}.`,
      `erroneous file name: ${fileName}.`,
      `erroneous parent folder id: ${folder.id}.`,
      `Called mutator: ${RemoveParentFolderFromUploadingListMutator.name}.`,
      `${RemoveParentFolderFromUploadingListMutator.name}.folder.id: ${folder.id}.`,
    ], 'All expected methods should be called in correct order.');
  });
});
