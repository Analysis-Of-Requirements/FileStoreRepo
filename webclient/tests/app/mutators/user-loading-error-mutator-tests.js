import UserLoadingErrorMutator from '../../../app/mutators/user-loading-error-mutator.js';

const {module, test} = QUnit;

export default module('User Loading Error Mutator', () => {

  test('should set error to a state.', (assert) => {
    assert.expect(1);

    const error = new Error('new error message');
    const mutator = new UserLoadingErrorMutator(error);

    const state = {};
    mutator.apply(state);

    assert.deepEqual(state.userLoadingError, error, 'Should apply error to state.');
  });
});
