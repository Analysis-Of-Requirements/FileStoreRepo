import State from '../../../app/state/state.js';
import ListItemsLoadingMutator from '../../../app/mutators/list-items-loading-mutator.js';

const {module, test} = QUnit;

export default module('List Items Loading Mutator', () => {

  test('should set \'isListItemsLoading\' value to state.', (assert) => {
    assert.expect(1);

    const state = new State();
    const isLoading = false;
    const mutator = new ListItemsLoadingMutator(isLoading);
    mutator.apply(state);

    assert.strictEqual(state.isListItemsLoading, isLoading, `Should be equal to applied isListItemsLoading value.`);
  });
});
