import RefreshListAction from '../../../app/actions/refresh-list-action.js';
import AddToRenamingInProgressMutator from '../../../app/mutators/add-to-renaming-in-progress-mutator.js';
import RemoveFromRenamingInProgressMutator from '../../../app/mutators/remove-from-renaming-in-progress-mutator.js';
import RenameListItemAction from '../../../app/actions/rename-list-item-action.js';
import RenamingItemErrorMutator from '../../../app/mutators/renaming-item-error-mutator.js';

const {module, test} = QUnit;

export default module('Rename List Item Action', () => {

  test('should correctly handle successful renaming.', async (assert) => {
    assert.expect(8);

    const stateManager = {
      apiService: {
        updateListItem: async (listItem) => {
          assert.step(`Should call ApiService.updateListItem() with list item: ${listItem.id}.`);
        },
      },

      dispatchAction(action) {
        assert.step(`Called action: ${action.constructor.name}.`);

        if (action instanceof RefreshListAction) {
          assert.step('Refreshed List Action was called.');
        }
      },

      mutate(mutator) {
        assert.step(`Called mutator: ${mutator.constructor.name}.`);

        if (mutator instanceof AddToRenamingInProgressMutator) {
          assert.step(`${mutator.constructor.name}.listItem: ${mutator._listItem.name}.`);
        } else if (mutator instanceof RemoveFromRenamingInProgressMutator) {
          assert.step(`${mutator.constructor.name}.listItem: ${mutator._listItem.name}.`);
        }
      },
    };

    const listItem = {
      id: 'mock-id',
      name: 'mock-name',
    };
    const action = new RenameListItemAction(listItem);
    await action.apply(stateManager);

    assert.verifySteps([
      `Called mutator: ${AddToRenamingInProgressMutator.name}.`,
      `${AddToRenamingInProgressMutator.name}.listItem: ${listItem.name}.`,
      `Should call ApiService.updateListItem() with list item: ${listItem.id}.`,
      `Called action: ${RefreshListAction.name}.`,
      'Refreshed List Action was called.',
      `Called mutator: ${RemoveFromRenamingInProgressMutator.name}.`,
      `${RemoveFromRenamingInProgressMutator.name}.listItem: ${listItem.name}.`,
    ], 'All expected methods should be called in correct order.');
  });

  test('should correctly handle failed deletion', async (assert) => {
    assert.expect(8);

    const message = 'Response error';
    const stateManager = {
      apiService: {
        async updateListItem(listItem) {
          assert.step(`Should call ApiService.renameListItem() with list item: ${listItem.id}.`);
          throw new Error(message);
        },
      },

      mutate(mutator) {
        assert.step(`Called mutator: ${mutator.constructor.name}.`);

        if (mutator instanceof AddToRenamingInProgressMutator) {
          assert.step(`${mutator.constructor.name}.listItem: ${mutator._listItem.name}.`);
        } else if (mutator instanceof RemoveFromRenamingInProgressMutator) {
          assert.step(`${mutator.constructor.name}.listItem: ${mutator._listItem.name}.`);
        } else if (mutator instanceof RenamingItemErrorMutator) {
          assert.step(`${mutator.constructor.name}.error: ${mutator._error}.`);
        }
      },
    };

    const listItem = {
      id: 'mock-id',
      name: 'mock-name',
    };
    const action = new RenameListItemAction(listItem);
    await action.apply(stateManager);

    assert.verifySteps([
      `Called mutator: ${AddToRenamingInProgressMutator.name}.`,
      `${AddToRenamingInProgressMutator.name}.listItem: ${listItem.name}.`,
      `Should call ApiService.renameListItem() with list item: ${listItem.id}.`,
      `Called mutator: ${RenamingItemErrorMutator.name}.`,
      `${RenamingItemErrorMutator.name}.error: ${new Error(message)}.`,
      `Called mutator: ${RemoveFromRenamingInProgressMutator.name}.`,
      `${RemoveFromRenamingInProgressMutator.name}.listItem: ${listItem.name}.`,
    ], 'All expected methods should be called in correct order.');
  });
});
