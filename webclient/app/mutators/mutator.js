/**
 * Used to control changes to a State.
 * @abstract
 */
export default class Mutator {

  /**
   * Applies changes in State object.
   *
   * @param {State} state - state to apply changes to.
   * @abstract
   */
  apply(state) {

  }
}
