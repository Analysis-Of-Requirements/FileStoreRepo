/**
 * State Manager over State.
 */
export default class StateManager extends EventTarget {

  /**
   * Application's state.
   * @type {Proxy<State>}
   * @private
   */
  _state;

  /**
   * Instantiates StateManager.
   *
   * @param {State} initialState - initial state.
   * @param {object} properties - configuration properties for StateManager. These may by services.
   * @param {ApiService} properties.apiService - api service for initiating requests.
   */
  constructor(initialState, {apiService}) {
    super();

    Object.assign(this, {apiService});

    const selfStateManager = this;
    const setHandler = {
      set: function(target, prop, value) {
        const successfulSet = Reflect.set(target, prop, value);

        if (successfulSet) {
          const stateChangedEvent = new CustomEvent(`statechanged.${prop}`, {
            detail: {
              state: selfStateManager._state,
            },
          });
          selfStateManager.dispatchEvent(stateChangedEvent);
        }

        return successfulSet;
      }
    };

    this._state = new Proxy(initialState, setHandler);
  }

  /**
   * Registers handler to be triggered on 'state-changed' event.
   *
   * @param {string} field - name of the field in State to apply handler to.
   * @param {function(Event): void} handler - 'state-changed' event handler.
   */
  onStateChanged(field, handler) {
    this.addEventListener(`statechanged.${field}`, handler);
  }

  /**
   * Removes on-state-changed event handler for a specified field.
   *
   * @param {string} field - field name of the State.
   * @param {function(Event): void} handler - handler of state-changed event.
   */
  removeStateChangedHandler(field, handler) {
    this.removeEventListener(`statechanged.${field}`, handler);
  }

  /**
   * Applies action on the component.
   *
   * @param {Action} action - action to apply.
   */
  async dispatchAction(action) {
    return action.apply(this);
  }

  /**
   * Mutates state by given mutator.
   *
   * @param {Mutator} mutator - perform changes of the State object.
   */
  mutate(mutator) {
    mutator.apply(this._state);
  }

  /**
   * Getter for state.
   *
   * @return {Proxy<State>} application state.
   */
  get state() {
    return this._state;
  }
}
