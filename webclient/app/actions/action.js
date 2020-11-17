/**
 * Action to apply over state.
 * @abstract
 */
export default class Action {

  /**
   * Applies action over state.
   *
   * @param {StateManager} stateManager - manager containing target state.
   * @return {Promise} - required to return promise in order to allow building promise chain.
   * @abstract
   */
  async apply(stateManager) {

  }
}
