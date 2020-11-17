import AddToDeletionInProgressMutator from '../../../app/mutators/add-to-deletion-in-progress-mutator.js';
import RefreshListAction from '../../../app/actions/refresh-list-action.js';
import RemoveFromDeletionInProgressMutator from '../../../app/mutators/remove-from-deletion-in-progress-mutator.js';
import RemoveListItemAction from '../../../app/actions/remove-list-item-action.js';
import ItemDeletionIssueMutator from '../../../app/mutators/item-deletion-issue-mutator.js';

const {module, test} = QUnit;

export default module('Remove List Item Action', () => {

  test('should correctly handle successful deletion.', async (assert) => {
    assert.expect(8);

    const stateManager = {
      apiService: {
        deleteListItem: async (listItem) => {
          assert.step(`Should call ApiService.deleteListItem() with list item: ${listItem.id}.`);
        },
      },

      dispatchAction(action) {
        assert.step(`Called action: ${action.constructor.name}.`);

        if (action instanceof RefreshListAction) {
          assert.step('Refreshed List Action is called.');
        }
      },

      mutate(mutator) {
        assert.step(`Called mutator: ${mutator.constructor.name}.`);

        if (mutator instanceof AddToDeletionInProgressMutator) {
          assert.step(`${mutator.constructor.name}.listItem: ${mutator._listItem.name}.`);
        } else if (mutator instanceof RemoveFromDeletionInProgressMutator) {
          assert.step(`${mutator.constructor.name}.listItem: ${mutator._listItem.name}.`);
        }
      },
    };

    const listItem = {
      id: 'mock-id',
      name: 'mock-name',
    };
    const action = new RemoveListItemAction(listItem);
    await action.apply(stateManager);

    assert.verifySteps([
      `Called mutator: ${AddToDeletionInProgressMutator.name}.`,
      `${AddToDeletionInProgressMutator.name}.listItem: ${listItem.name}.`,
      `Should call ApiService.deleteListItem() with list item: ${listItem.id}.`,
      `Called action: ${RefreshListAction.name}.`,
      'Refreshed List Action is called.',
      `Called mutator: ${RemoveFromDeletionInProgressMutator.name}.`,
      `${RemoveFromDeletionInProgressMutator.name}.listItem: ${listItem.name}.`,
    ], 'All expected methods should be called in correct order.');
  });

  test('should correctly handle failed deletion', async (assert) => {
    assert.expect(8);

    const message = 'Response error';
    const stateManager = {
      apiService: {
        deleteListItem: async (listItem) => {
          assert.step(`Should call ApiService.deleteListItem() with list item: ${listItem.id}.`);
          throw new Error(message);
        },
      },

      mutate(mutator) {
        assert.step(`Called mutator: ${mutator.constructor.name}.`);

        if (mutator instanceof AddToDeletionInProgressMutator) {
          assert.step(`${mutator.constructor.name}.listItem: ${mutator._listItem.name}.`);
        } else if (mutator instanceof RemoveFromDeletionInProgressMutator) {
          assert.step(`${mutator.constructor.name}.listItem: ${mutator._listItem.name}.`);
        } else if (mutator instanceof ItemDeletionIssueMutator) {
          assert.step(`${mutator.constructor.name}.error: ${mutator._error}.`);
        }
      },
    };

    const listItem = {
      id: 'mock-id',
      name: 'mock-name',
    };
    const action = new RemoveListItemAction(listItem);
    await action.apply(stateManager);

    assert.verifySteps([
      `Called mutator: ${AddToDeletionInProgressMutator.name}.`,
      `${AddToDeletionInProgressMutator.name}.listItem: ${listItem.name}.`,
      `Should call ApiService.deleteListItem() with list item: ${listItem.id}.`,
      `Called mutator: ${ItemDeletionIssueMutator.name}.`,
      `${ItemDeletionIssueMutator.name}.error: ${new Error(message)}.`,
      `Called mutator: ${RemoveFromDeletionInProgressMutator.name}.`,
      `${RemoveFromDeletionInProgressMutator.name}.listItem: ${listItem.name}.`,
    ], 'All expected methods should be called in correct order.');
  });
});
