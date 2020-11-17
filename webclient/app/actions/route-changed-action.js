import Action from './action.js';
import LocationMutator from '../mutators/location-mutator.js';
import LocationParametersMutator from '../mutators/location-parameters-mutator.js';

/**
 * Action reacts on changed route.
 */
export default class RouteChangedAction extends Action {

  /**
   * Static part of the url.
   * @type {string}
   */
  _staticPart;

  /**
   * Dynamic part of the url.
   * @type {object}
   */
  _dynamicPart;

  /**
   * @inheritdoc
   * @param {string} staticPart - static part of the url. For example: in url 'https://example.com/folder/:folderId'
   * static part is 'folder'.
   * @param {object} dynamicPart - dynamic part of the url. For example: in template
   * 'https://example.com/folder/:folderId' dynamic part is value of key 'folderId'.
   */
  constructor(staticPart, dynamicPart) {
    super();
    this._staticPart = staticPart;
    this._dynamicPart = dynamicPart;
  }

  /**
   * @inheritdoc
   */
  async apply(stateManager) {
    const {_staticPart, _dynamicPart} = this;
    const locationParametersMutator = new LocationParametersMutator(_dynamicPart);

    if (stateManager.state.location !== _staticPart) {
      const locationMutator = new LocationMutator(_staticPart);
      stateManager.mutate(locationMutator);
      stateManager.mutate(locationParametersMutator);
      return;
    }

    if (Object.keys(_dynamicPart).length) {
      stateManager.mutate(locationParametersMutator);
    }
  }
}
