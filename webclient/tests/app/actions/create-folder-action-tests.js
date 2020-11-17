import AddParentFolderToCreatingInProgressMutator
  from '../../../app/mutators/add-parent-folder-to-creating-in-progress-mutator.js';
import CreateFolderAction from '../../../app/actions/create-folder-action.js';
import FolderCreatingErrorMutator from '../../../app/mutators/folder-creating-error-mutator.js';
import RemoveParentFolderFromCreatingInProgressMutator
  from '../../../app/mutators/remove-parent-folder-from-creating-in-progress-mutator.js';

const {module, test} = QUnit;

export default module('Create Folder Action', () => {

  test('should correctly handle successful folder creating.', async (assert) => {
    assert.expect(6);

    const folder = {
      id: 'mock-folder-id',
    };
    const parentFolder = {
      id: 'parent-folder-id',
    };
    const stateManager = {
      apiService: {
        createFolder: async (id) => {
          assert.step(`Should call ApiService.createFolder() with passed folder id: ${id}.`);
          return folder;
        },
      },

      mutate(mutator) {
        assert.step(`Called mutator: ${mutator.constructor.name}.`);

        if (mutator instanceof AddParentFolderToCreatingInProgressMutator) {
          assert.step(`${mutator.constructor.name}._parentFolder.id: ${mutator._parentFolder.id}.`);
        } else if (mutator instanceof RemoveParentFolderFromCreatingInProgressMutator) {
          assert.step(`${mutator.constructor.name}._parentFolder.id: ${mutator._parentFolder.id}.`);
        }
      },
    };

    const action = new CreateFolderAction(parentFolder);
    await action.apply(stateManager);

    assert.verifySteps([
      `Called mutator: ${AddParentFolderToCreatingInProgressMutator.name}.`,
      `${AddParentFolderToCreatingInProgressMutator.name}._parentFolder.id: ${parentFolder.id}.`,
      `Should call ApiService.createFolder() with passed folder id: ${parentFolder.id}.`,
      `Called mutator: ${RemoveParentFolderFromCreatingInProgressMutator.name}.`,
      `${RemoveParentFolderFromCreatingInProgressMutator.name}._parentFolder.id: ${parentFolder.id}.`,
    ], 'All expected methods should were called in correct order.');
  });

  test('should correctly handle failed folder creating.', async (assert) => {
    assert.expect(8);

    const errorMessage = 'Error Message';
    const stateManager = {
      apiService: {
        createFolder: async (id) => {
          assert.step(`Should call ApiService.createFolder() with passed folder id: ${id}.`);
          throw new Error(errorMessage);
        },
      },

      mutate(mutator) {
        assert.step(`Called mutator: ${mutator.constructor.name}.`);

        if (mutator instanceof AddParentFolderToCreatingInProgressMutator) {
          assert.step(`${mutator.constructor.name}._parentFolder.id: ${mutator._parentFolder.id}.`);
        } else if (mutator instanceof FolderCreatingErrorMutator) {
          assert.step(`${mutator.constructor.name}.error.message: ${mutator._error.message}.`);
        } else if (mutator instanceof RemoveParentFolderFromCreatingInProgressMutator) {
          assert.step(`${mutator.constructor.name}._parentFolder.id: ${mutator._parentFolder.id}.`);
        }
      },
    };

    const parentFolder = {
      id: 'parent-folder-id',
    };
    const action = new CreateFolderAction(parentFolder);
    await action.apply(stateManager);

    assert.verifySteps([
      `Called mutator: ${AddParentFolderToCreatingInProgressMutator.name}.`,
      `${AddParentFolderToCreatingInProgressMutator.name}._parentFolder.id: ${parentFolder.id}.`,
      `Should call ApiService.createFolder() with passed folder id: ${parentFolder.id}.`,
      `Called mutator: ${FolderCreatingErrorMutator.name}.`,
      `${FolderCreatingErrorMutator.name}.error.message: ${errorMessage}.`,
      `Called mutator: ${RemoveParentFolderFromCreatingInProgressMutator.name}.`,
      `${RemoveParentFolderFromCreatingInProgressMutator.name}._parentFolder.id: ${parentFolder.id}.`,
    ], 'All expected methods should were called in correct order.');
  });
});
