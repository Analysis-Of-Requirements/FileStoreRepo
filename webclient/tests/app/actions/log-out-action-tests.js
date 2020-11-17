import LogOutAction from '../../../app/actions/log-out-action.js';

const {module, test} = QUnit;

export default module('Log Out Action', () => {

  test('should call proper mutators on resolved response.', async (assert) => {
    assert.expect(2);

    const action = new LogOutAction();
    const stateManager = {
      apiService: {
        async logOut() {
          assert.step('Should call ApiService.logOut().');
        },
      },
    };
    await action.apply(stateManager);

    assert.verifySteps([
      'Should call ApiService.logOut().',
    ], 'Action was successfully applied.');
  });

  test('should call proper mutators on resolved response.', async (assert) => {
    assert.expect(3);

    const error = new Error('Error.');
    const action = new LogOutAction();
    const stateManager = {
      apiService: {
        async logOut() {
          assert.step('Should call ApiService.logOut().');
          throw error;
        },
      },
    };

    try {
      await action.apply(stateManager);
    } catch (error) {
      assert.step('Should not handle error.');
    }

    assert.verifySteps([
      'Should call ApiService.logOut().',
      'Should not handle error.',
    ], 'Action was successfully applied.');
  });
});
