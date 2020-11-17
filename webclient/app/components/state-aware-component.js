import Component from './component.js';

/**
 * Component that relies on storing it's data in @see {@link State}.
 * @abstract
 */
export default class StateAwareComponent extends Component {

  /**
   * Instantiates StateAwareComponent.
   *
   * @param {HTMLElement} container - parent container.
   * @param {StateManager} stateManager - manager over state.
   * @param {object} properties - configuration properties for the component.
   */
  constructor(container, stateManager, properties) {
    super(container, Object.assign(properties, {stateManager}));
    this.initState();
  }

  /**
   * @inheritdoc
   */
  initComponent() {
    super.initComponent();
    this._onStateChangedHandlers = [];
  }

  /**
   * Initializes State.
   * @abstract
   */
  initState() {

  }

  /**
   * @inheritdoc
   */
  willDestroy() {
    this._removeStateChangedEventListeners();
  }

  /**
   * Registers on-state-changed handler for specified field of handler.
   *
   * @param {string} field - field name of the State.
   * @param {function(State): void} handler - handler for state-changed event.
   */
  onStateChanged(field, handler) {
    const {_onStateChangedHandlers} = this;
    const {stateManager} = this.properties;
    const wrapperHandler = (event) => handler(event.detail.state);
    stateManager.onStateChanged(field, wrapperHandler);
    _onStateChangedHandlers.push({
      field,
      handler: wrapperHandler,
    });
  }

  /**
   * Removes registered on-state-changed event listeners.
   * @private
   */
  _removeStateChangedEventListeners() {
    const {_onStateChangedHandlers} = this;
    const {stateManager} = this.properties;
    _onStateChangedHandlers.forEach(({field, handler}) => stateManager.removeStateChangedHandler(field, handler));
  }

  /**
   * Dispatches action.
   *
   * @param {Action} action - action to dispatch.
   * @return {Promise} resulting promise.
   */
  async dispatch(action) {
    return this.properties.stateManager.dispatchAction(action);
  }
}
