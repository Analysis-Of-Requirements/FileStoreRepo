import RenamingItemErrorMutator from '../../../app/mutators/renaming-item-error-mutator.js';

const {module, test} = QUnit;

export default module('Renaming items issue mutator tests', () => {

  test('should set error to a state.', (assert) => {
    assert.expect(1);
    const error = new Error('new error message');
    const item = {
      id: 'mock-name',
    };
    const mutator = new RenamingItemErrorMutator(error, item);
    const state = {};
    mutator.apply(state);
    assert.deepEqual(state.renamingIssue, {
      itemRenamingError: error,
      notRenamedItem: item,
    }, 'Should apply error issue to state.');
  });
});
