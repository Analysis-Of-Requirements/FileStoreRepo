import Mutator from './mutator.js';

/**
 * Applies location value to state.
 */
export default class LocationMutator extends Mutator {

  /**
   * Static part of the url.
   * @type {string}.
   */
  _location;

  /**
   * @inheritdoc
   * @param {string} location - static part of the url.
   */
  constructor(location) {
    super();
    this._location = location;
  }

  /**
   * @inheritdoc
   */
  apply(state) {
    state.location = this._location;
  }
}
