import Mutator from './mutator.js';

/**
 * Applies location parameter to a state.
 */
export default class LocationParametersMutator extends Mutator {

  /**
   * Dynamic part of the url.
   * @type {object}
   */
  _locationParams;

  /**
   * @inheritdoc
   * @param {object} locationParams - location parameters of a state.
   */
  constructor(locationParams) {
    super();
    this._locationParams = locationParams;
  }

  /**
   * @inheritdoc
   */
  apply(state) {
    state.locationParams = this._locationParams;
  }
}
