/**
 * Describes validation error case: which filed has error.
 */
export default class ValidationErrorCase extends Error {
  /**
   * Field on the form, which has erroneous input.
   *
   * @type {string}
   * @private
   */
  _field;

  /**
   * Error description.
   *
   * @type {string}
   * @private
   */
  _message;

  /**
   * Instantiates Validation Error Case object.
   *
   * @param {JSON} case - error case describing error.
   * @param {string} case.field - field on the form, which has erroneous input.
   * @param {string} case.message - error description.
   */
  constructor({field, message}) {
    super();
    this._message = message;
    this._field = field;
  }

  /**
   * Getter for error message.
   *
   * @return {string} error message.
   */
  get message() {
    return this._message;
  }

  /**
   * Getter for form field.
   *
   * @return {string} erroneous field.
   */
  get field() {
    return this._field;
  }
}
