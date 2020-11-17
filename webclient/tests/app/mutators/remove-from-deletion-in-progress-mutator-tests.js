import RemoveFromDeletionInProgressMutator from '../../../app/mutators/remove-from-deletion-in-progress-mutator.js';

const {module, test} = QUnit;

export default module('Remove From Deletion In Progress Mutator', () => {

  test('should remove list item from list of items-to-delete', (assert) => {
    assert.expect(3);

    const listItem = {
      id: 'mock-id',
    };
    const state = {
      set listItemsToDelete(listItems) {
        assert.step(`Should set list items: ${listItems.length}.`);
      },
      get listItemsToDelete() {
        assert.step('Should retrieve list items.');
        return [listItem];
      },
    };
    const mutator = new RemoveFromDeletionInProgressMutator(listItem);
    mutator.apply(state);

    assert.verifySteps([
      'Should retrieve list items.',
      `Should set list items: 0.`,
    ], 'Should proper;y mutate state.');
  });
});
