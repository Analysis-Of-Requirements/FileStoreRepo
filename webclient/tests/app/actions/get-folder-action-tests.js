import FolderLoadingErrorMutator from '../../../app/mutators/folder-loading-error-mutator.js';
import GetFolderAction from '../../../app/actions/get-folder-action.js';
import FolderMutator from '../../../app/mutators/folder-mutator.js';
import FolderLoadingMutator from '../../../app/mutators/folder-loading-mutator.js';

const {module, test} = QUnit;

export default module('Get Folder Action', () => {

  test('should call proper mutators on resolved response.', async (assert) => {
    assert.expect(8);

    const id = 'mock-id';
    const stateManager = {
      apiService: {
        getFolder: async (folderId) => {
          assert.step(`Should call ApiService.getFolder(${folderId}).`);

          return {
            id,
          };
        },
      },

      mutate(mutator) {
        assert.step(`Called mutator: ${mutator.constructor.name}.`);

        if (mutator instanceof FolderLoadingMutator) {
          assert.step(`${mutator.constructor.name}.isLoading: ${mutator._isLoading}.`);
        } else if (mutator instanceof FolderMutator) {
          assert.step(`${mutator.constructor.name}.folderItem.id: '${mutator._folderItem.id}'.`);
        }
      },
    };
    const folderId = 'admin-folder';
    const action = new GetFolderAction(folderId);
    await action.apply(stateManager);

    assert.verifySteps([
      `Called mutator: ${FolderLoadingMutator.name}.`,
      `${FolderLoadingMutator.name}.isLoading: true.`,
      `Should call ApiService.getFolder(${folderId}).`,
      `Called mutator: ${FolderMutator.name}.`,
      `${FolderMutator.name}.folderItem.id: '${id}'.`,
      `Called mutator: ${FolderLoadingMutator.name}.`,
      `${FolderLoadingMutator.name}.isLoading: false.`,
    ], 'All necessary mutators were called in correct order.');
  });

  test('should call proper mutators on rejected response.', async (assert) => {
    assert.expect(8);

    const errorMessage = 'Response error.';
    const stateManager = {
      apiService: {
        getFolder: async (folderId) => {
          assert.step(`Should call ApiService.getFolder(${folderId}).`);
          throw new Error(errorMessage);
        },
      },

      mutate(mutator) {
        assert.step(`Called mutator: ${mutator.constructor.name}.`);

        if (mutator instanceof FolderLoadingMutator) {
          assert.step(`${mutator.constructor.name}.isLoading: ${mutator._isLoading}.`);
        } else if (mutator instanceof FolderLoadingErrorMutator) {
          assert.step(`${mutator.constructor.name}.error: ${mutator._error}.`);
        }
      },
    };
    const folderId = 'admin-folder';
    const action = new GetFolderAction(folderId);
    await action.apply(stateManager);

    assert.verifySteps([
      `Called mutator: ${FolderLoadingMutator.name}.`,
      `${FolderLoadingMutator.name}.isLoading: true.`,
      `Should call ApiService.getFolder(${folderId}).`,
      `Called mutator: ${FolderLoadingErrorMutator.name}.`,
      `${FolderLoadingErrorMutator.name}.error: Error: ${errorMessage}.`,
      `Called mutator: ${FolderLoadingMutator.name}.`,
      `${FolderLoadingMutator.name}.isLoading: false.`,
    ], 'All necessary mutators were called in correct order.');
  });
});
