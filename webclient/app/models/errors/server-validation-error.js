import ValidationErrorCase from './validation-error-case.js';

/**
 * Represents class of 422 HTTP responses: Unprocessable Entity.
 * The request was well-formed but was unable to be followed due to semantic errors.
 */
export default class ServerValidationError extends Error {
  /**
   * Error message.
   *
   * @type {ValidationErrorCase[]}
   * @private
   */
  _validationErrorCases;

  /**
   * Instantiates Validation Error.
   *
   * @param {JSON} serverResponse - response from server.
   * @param {ValidationErrorCase[]} serverResponse.validationErrors - array having different cases of validation error.
   * @example
   * {
   *   "validationErrors": [
   *     {
   *       "field": "login",
   *       "message": "This login already exists"
   *     },
   *     {...}
   *   ]
   * }
   */
  constructor(serverResponse) {
    super();
    this._validationErrorCases = serverResponse
      .validationErrors
      .map((errorCase) => new ValidationErrorCase(errorCase));
  }

  /**
   * Checks that there is an error case with such a field.
   *
   * @param {string} field - field of the error.
   * @return {boolean} true if error exists.
   */
  hasErrorCase(field) {
    return this._validationErrorCases.some((errorCase) => errorCase.field === field);
  }

  /**
   * Retrieves error which has the same field as the provided one.
   *
   * @param {string} field - field of the error.
   * @return {ValidationErrorCase} first matching error case.
   */
  getErrorCase(field) {
    return this._validationErrorCases.find((errorCase) => errorCase.field === field);
  }
}
