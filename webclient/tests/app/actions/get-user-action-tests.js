import UserLoadingMutator from '../../../app/mutators/user-loading-mutator.js';
import SetUserMutator from '../../../app/mutators/set-user-mutator.js';
import GetUserAction from '../../../app/actions/get-user-action.js';
import UserLoadingErrorMutator from '../../../app/mutators/user-loading-error-mutator.js';

const {module, test} = QUnit;

export default module('Get User Action', () => {

  test('should correctly handle successful user retrieving.', async (assert) => {
    assert.expect(8);

    const userId = 'mock-user-id';
    const stateManager = {

      apiService: {
        async getUser() {
          assert.step('Should call ApiService.getUser().');

          return {
            id: userId,
            name: '',
          };
        },
      },

      mutate(mutator) {
        assert.step(`Called mutator: ${mutator.constructor.name}.`);

        if (mutator instanceof UserLoadingMutator) {
          assert.step(`${mutator.constructor.name}.isLoading: ${mutator._isLoading}.`);
        } else if (mutator instanceof SetUserMutator) {
          assert.step(`${mutator.constructor.name}.user.id: ${mutator._userObject.id}.`);
        }
      },
    };

    const action = new GetUserAction();
    await action.apply(stateManager);

    assert.verifySteps([
      `Called mutator: ${UserLoadingMutator.name}.`,
      `${UserLoadingMutator.name}.isLoading: true.`,
      'Should call ApiService.getUser().',
      `Called mutator: ${SetUserMutator.name}.`,
      `${SetUserMutator.name}.user.id: ${userId}.`,
      `Called mutator: ${UserLoadingMutator.name}.`,
      `${UserLoadingMutator.name}.isLoading: false.`,
    ], 'All expected methods should be called in correct order.');
  });

  test('should correctly handle failed user retrieving.', async (assert) => {
    assert.expect(8);

    const errorMessage = 'error message';
    const stateManager = {

      apiService: {
        async getUser() {
          assert.step('Should call ApiService.getUser().');
          throw Error(errorMessage);
        },
      },

      mutate(mutator) {
        assert.step(`Called mutator: ${mutator.constructor.name}.`);

        if (mutator instanceof UserLoadingMutator) {
          assert.step(`${mutator.constructor.name}.isLoading: ${mutator._isLoading}.`);
        } else if (mutator instanceof UserLoadingErrorMutator) {
          assert.step(`${mutator.constructor.name}.error.message: ${mutator._error.message}.`);
        }
      },
    };

    const action = new GetUserAction();
    await action.apply(stateManager);

    assert.verifySteps([
      `Called mutator: ${UserLoadingMutator.name}.`,
      `${UserLoadingMutator.name}.isLoading: true.`,
      'Should call ApiService.getUser().',
      `Called mutator: ${UserLoadingErrorMutator.name}.`,
      `${UserLoadingErrorMutator.name}.error.message: ${errorMessage}.`,
      `Called mutator: ${UserLoadingMutator.name}.`,
      `${UserLoadingMutator.name}.isLoading: false.`,
    ], 'All expected methods should be called in correct order.');
  });
});
