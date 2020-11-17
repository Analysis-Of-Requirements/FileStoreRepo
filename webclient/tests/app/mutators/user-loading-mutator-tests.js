import UserLoadingMutator from '../../../app/mutators/user-loading-mutator.js';

const {module, test} = QUnit;

export default module('User Loading Mutator', () => {

  test('should set \'userLoading\' value to state.', (assert) => {
    assert.expect(1);

    const state = {};
    const isLoading = true;
    const mutator = new UserLoadingMutator(isLoading);
    mutator.apply(state);

    assert.strictEqual(state.isUserLoading, isLoading, 'Should be equal to applied isUserLoading value.');
  });
});
