import Mutator from './mutator.js';
import UserModel from '../models/user-model.js';

/**
 * Mutates user property of the State object.
 */
export default class SetUserMutator extends Mutator {

  /**
   * Instantiates SetUserMutator.
   *
   * @param {{id: string, name: string}} userObject - object with user data.
   */
  constructor(userObject) {
    super();
    this._userObject = userObject;
  }

  /**
   * @inheritdoc
   */
  apply(state) {
    state.currentUser = new UserModel(this._userObject);
  }
}
