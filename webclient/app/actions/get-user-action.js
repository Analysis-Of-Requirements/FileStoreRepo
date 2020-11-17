import Action from './action.js';
import SetUserMutator from '../mutators/set-user-mutator.js';
import UserLoadingMutator from '../mutators/user-loading-mutator.js';
import UserLoadingErrorMutator from '../mutators/user-loading-error-mutator.js';

/**
 * Actions is aimed to retrieve user info.
 */
export default class GetUserAction extends Action {

  /**
   * @inheritdoc
   */
  async apply(stateManager) {
    stateManager.mutate(new UserLoadingMutator(true));

    return stateManager.apiService.getUser()
      .then((userObject) => stateManager.mutate(new SetUserMutator(userObject)))
      .catch((error) => stateManager.mutate(new UserLoadingErrorMutator(error)))
      .finally(() => stateManager.mutate(new UserLoadingMutator(false)));
  }
}
