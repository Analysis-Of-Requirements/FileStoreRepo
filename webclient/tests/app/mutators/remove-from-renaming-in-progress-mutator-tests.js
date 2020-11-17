import RemoveFromRenamingInProgressMutator from '../../../app/mutators/remove-from-renaming-in-progress-mutator.js';

const {module, test} = QUnit;

export default module('Remove From Renaming In Progress Mutator', () => {

  test('should remove list item from renaming items', (assert) => {
    assert.expect(3);

    const listItem = {
      id: 'mock-id',
    };
    const state = {
      set renamingListItems(listItems) {
        assert.step(`Should set list items: ${listItems.length}.`);
      },
      get renamingListItems() {
        assert.step('Should retrieve list items.');
        return [listItem];
      },
    };
    const mutator = new RemoveFromRenamingInProgressMutator(listItem);
    mutator.apply(state);

    assert.verifySteps([
      'Should retrieve list items.',
      `Should set list items: 0.`,
    ], 'Should proper;y mutate state.');
  });
});
