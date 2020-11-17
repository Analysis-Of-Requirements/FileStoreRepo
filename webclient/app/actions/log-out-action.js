import Action from './action.js';

/**
 * Actions initiates logging user out,
 */
export default class LogOutAction extends Action {

  /**
   * @inheritdoc
   */
  async apply(stateManager) {

    return stateManager.apiService.logOut();
  }
}
