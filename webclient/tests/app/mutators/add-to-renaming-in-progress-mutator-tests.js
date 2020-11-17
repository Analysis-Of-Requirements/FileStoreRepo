import AddToRenamingInProgressMutator from '../../../app/mutators/add-to-renaming-in-progress-mutator.js';

const {module, test} = QUnit;

export default module('Add To Renaming In Progress Mutator', () => {

  test('should set list item to list of renaming list items.', (assert) => {
    assert.expect(3);

    const state = {
      set renamingListItems(listItems) {
        assert.step(`Should set list items: ${listItems.length}.`);
      },
      get renamingListItems() {
        assert.step('Should retrieve list items.');
        return [];
      },
    };
    const listItem = {
      id: 'mock-id',
    };
    const mutator = new AddToRenamingInProgressMutator(listItem);
    mutator.apply(state);

    assert.verifySteps([
      'Should retrieve list items.',
      `Should set list items: 1.`,
    ], 'Should proper;y mutate state.');
  });
});
