import ItemDeletionIssueMutator from '../../../app/mutators/item-deletion-issue-mutator.js';

const {module, test} = QUnit;

export default module('Item Deletion Issue Mutator', () => {

  test('should set error to a state.', (assert) => {
    assert.expect(1);
    const error = new Error('new error message');
    const item = {
      id: 'mock-name',
    };
    const mutator = new ItemDeletionIssueMutator(error, item);
    const state = {};
    mutator.apply(state);
    assert.deepEqual(state.deletionIssue, {
      itemDeletionError: error,
      notDeletedItem: item,
    }, 'Should apply error issue to state.');
  });
});
