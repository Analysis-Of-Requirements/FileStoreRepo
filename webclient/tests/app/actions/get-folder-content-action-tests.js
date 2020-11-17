import GetFolderContentAction from '../../../app/actions/get-folder-content-action.js';
import ListItemsLoadingMutator from '../../../app/mutators/list-items-loading-mutator.js';
import ListItemsMutator from '../../../app/mutators/list-items-mutator.js';
import ListItemsLoadingErrorMutator from '../../../app/mutators/list-items-loading-error-mutator.js';

const {module, test} = QUnit;

export default module('Get Folder Content Action', () => {

  test('should follow correct order of calls of StateManager and ApiService methods for resolved response.', async (assert) => {
    assert.expect(8);

    const stateManager = {
      apiService: {
        getFolderContent: async (folderId) => {
          assert.step(`Should call ApiService.getFolderContent() with passed folderId: ${folderId}.`);

          return {
            listItems: [{
              id: 'mock-id',
            }],
          };
        },
      },

      mutate(mutator) {
        assert.step(`Called mutator: ${mutator.constructor.name}.`);

        if (mutator instanceof ListItemsLoadingMutator) {
          assert.step(`${mutator.constructor.name}.isLoading: ${mutator._isLoading}.`);
        } else if (mutator instanceof ListItemsMutator) {
          assert.step(`${mutator.constructor.name}.listItems.length: ${mutator._listItems.length}.`);
        }
      },
    };

    const folderId = 'mock-folder-id';
    const action = new GetFolderContentAction(folderId);
    await action.apply(stateManager);

    assert.verifySteps([
      `Called mutator: ${ListItemsLoadingMutator.name}.`,
      `${ListItemsLoadingMutator.name}.isLoading: true.`,
      `Should call ApiService.getFolderContent() with passed folderId: ${folderId}.`,
      `Called mutator: ${ListItemsMutator.name}.`,
      `${ListItemsMutator.name}.listItems.length: 1.`,
      `Called mutator: ${ListItemsLoadingMutator.name}.`,
      `${ListItemsLoadingMutator.name}.isLoading: false.`,
    ], 'All expected methods should be called in correct order.');
  });

  test('should follow correct order of calls of StateManager and ApiService methods for rejected response.', async (assert) => {
    assert.expect(8);

    const errorMessage = 'Response error.';
    const stateManager = {
      apiService: {
        getFolderContent: async (folderId) => {
          assert.step(`Should call ApiService.getFolderContent() with passed folderId: ${folderId}.`);
          throw new Error(errorMessage);
        },
      },

      mutate(mutator) {
        assert.step(`Called mutator: ${mutator.constructor.name}.`);

        if (mutator instanceof ListItemsLoadingMutator) {
          assert.step(`${mutator.constructor.name}.isLoading: ${mutator._isLoading}.`);
        } else if (mutator instanceof ListItemsLoadingErrorMutator) {
          assert.step(`${mutator.constructor.name}.error: ${mutator._error}.`);
        }
      },
    };

    const folderId = 'mock-folder-id';
    const action = new GetFolderContentAction(folderId);
    await action.apply(stateManager);

    assert.verifySteps([
      `Called mutator: ${ListItemsLoadingMutator.name}.`,
      `${ListItemsLoadingMutator.name}.isLoading: true.`,
      `Should call ApiService.getFolderContent() with passed folderId: ${folderId}.`,
      `Called mutator: ${ListItemsLoadingErrorMutator.name}.`,
      `${ListItemsLoadingErrorMutator.name}.error: Error: ${errorMessage}.`,
      `Called mutator: ${ListItemsLoadingMutator.name}.`,
      `${ListItemsLoadingMutator.name}.isLoading: false.`,
    ], 'All expected methods should be called in correct order.');
  });
});
