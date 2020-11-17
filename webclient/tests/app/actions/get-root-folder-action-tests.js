import FolderLoadingMutator from '../../../app/mutators/folder-loading-mutator.js';
import GetRootFolderAction from '../../../app/actions/get-root-folder-action.js';
import RootFolderMutator from '../../../app/mutators/root-folder-mutator.js';
import RootFolderLoadingErrorMutator from '../../../app/mutators/root-folder-loading-error-mutator.js';

const {module, test} = QUnit;

export default module('Get Root Folder Action', () => {

  test('should call proper mutators on resolved response.', async (assert) => {
    assert.expect(8);

    const id = 'mock-id';
    const stateManager = {
      apiService: {
        getRootFolder: async () => {
          assert.step('Should call ApiService.getRootFolder().');

          return {
            id,
          };
        },
      },

      mutate(mutator) {
        assert.step(`Called mutator: ${mutator.constructor.name}.`);

        if (mutator instanceof FolderLoadingMutator) {
          assert.step(`${mutator.constructor.name}.isLoading: ${mutator._isLoading}.`);
        } else if (mutator instanceof RootFolderMutator) {
          assert.step(`${mutator.constructor.name}.folderItem.id: '${mutator._rootFolderItem.id}'.`);
        }
      },
    };

    const action = new GetRootFolderAction();
    await action.apply(stateManager);

    assert.verifySteps([
      `Called mutator: ${FolderLoadingMutator.name}.`,
      `${FolderLoadingMutator.name}.isLoading: true.`,
      'Should call ApiService.getRootFolder().',
      `Called mutator: ${RootFolderMutator.name}.`,
      `${RootFolderMutator.name}.folderItem.id: '${id}'.`,
      `Called mutator: ${FolderLoadingMutator.name}.`,
      `${FolderLoadingMutator.name}.isLoading: false.`,
    ], 'All necessary mutators were called in correct order.');
  });

  test('should call proper mutators on rejected response.', async (assert) => {
    assert.expect(8);

    const errorMessage = 'Response error.';
    const stateManager = {
      apiService: {
        getRootFolder: async () => {
          assert.step(`Should call ApiService.getRootFolder().`);
          throw new Error(errorMessage);
        },
      },

      mutate(mutator) {
        assert.step(`Called mutator: ${mutator.constructor.name}.`);

        if (mutator instanceof FolderLoadingMutator) {
          assert.step(`${mutator.constructor.name}.isLoading: ${mutator._isLoading}.`);
        } else if (mutator instanceof RootFolderLoadingErrorMutator) {
          assert.step(`${mutator.constructor.name}.error: ${mutator._error}.`);
        }
      },
    };
    const action = new GetRootFolderAction();
    await action.apply(stateManager);

    assert.verifySteps([
      `Called mutator: ${FolderLoadingMutator.name}.`,
      `${FolderLoadingMutator.name}.isLoading: true.`,
      'Should call ApiService.getRootFolder().',
      `Called mutator: ${RootFolderLoadingErrorMutator.name}.`,
      `${RootFolderLoadingErrorMutator.name}.error: Error: ${errorMessage}.`,
      `Called mutator: ${FolderLoadingMutator.name}.`,
      `${FolderLoadingMutator.name}.isLoading: false.`,
    ], 'All necessary mutators were called in correct order.');
  });
});
