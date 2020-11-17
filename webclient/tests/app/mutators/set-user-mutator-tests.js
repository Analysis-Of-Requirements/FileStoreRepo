import SetUserMutator from '../../../app/mutators/set-user-mutator.js';
import UserModel from '../../../app/models/user-model.js';

const {module, test} = QUnit;

export default module('Set User Mutator', () => {

  test('should set user model to state.', (assert) => {
    assert.expect(1);

    const state = {};
    const userObject = {
      id: 'mock-id',
      name: 'mock-id',
    }
    const mutator = new SetUserMutator(userObject);
    mutator.apply(state);

    assert.deepEqual(state.currentUser, new UserModel(userObject), 'Should set user model to state.');
  });
});

