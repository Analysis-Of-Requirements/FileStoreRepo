import State from '../../../app/state/state.js';
import ListItemsLoadingErrorMutator from '../../../app/mutators/list-items-loading-error-mutator.js';

const {module, test} = QUnit;

export default module('List Items Loading Error Mutator', () => {

  test('should set error to a state.', (assert) => {
    assert.expect(1);
    const error = new Error('new error message');
    const mutator = new ListItemsLoadingErrorMutator(error);
    const state = new State();
    mutator.apply(state);
    assert.deepEqual(state.listItemsLoadingError, error, 'Should apply error to state.');
  });
});
