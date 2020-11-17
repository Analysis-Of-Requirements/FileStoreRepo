/**
 * Storage of event handlers, which are equal by parameters number and type and return type.
 */
export default class EventHandlersStorage {

  /**
   * Array of event handlers.
   * @type {function(*)[]}
   */
  _eventHandlers = [];

  /**
   * Adds event handler to a storage.
   *
   * @param {function(*)} handler - event handler.
   */
  addEventHandler(handler) {
    if (typeof handler !== 'function') {
      throw new TypeError('Arguments of wrong type passed. It must be a function.');
    }
    this._eventHandlers.push(handler);
  }

  /**
   * Executes handlers passing given parameters.
   *
   * @param {*} parameters - input parameters of handlers.
   */
  executeHandlers(...parameters) {
    this._eventHandlers.forEach((handler) => handler(...parameters));
  }
}
