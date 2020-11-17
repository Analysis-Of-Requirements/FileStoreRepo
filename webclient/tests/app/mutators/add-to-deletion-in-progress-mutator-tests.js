import AddToDeletionInProgressMutator from '../../../app/mutators/add-to-deletion-in-progress-mutator.js';

const {module, test} = QUnit;

export default module('Add To Deletion In Progress Mutator', () => {

  test('should set list item to list of items-to-delete', (assert) => {
    assert.expect(3);

    const state = {
      set listItemsToDelete(listItems) {
        assert.step(`Should set list items: ${listItems.length}.`);
      },
      get listItemsToDelete() {
        assert.step('Should retrieve list items.');
        return [];
      },
    };
    const listItem = {
      id: 'mock-id',
    };
    const mutator = new AddToDeletionInProgressMutator(listItem);
    mutator.apply(state);

    assert.verifySteps([
      'Should retrieve list items.',
      `Should set list items: 1.`,
    ], 'Should proper;y mutate state.');
  });
});
