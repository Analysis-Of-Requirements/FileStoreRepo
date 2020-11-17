/**
 * Abstract class for validation text data.
 * Each specific descendant represents one use-case of validation, e.g, checks for input length.
 * @abstract
 */
export default class AbstractInputValidator {

  /**
   * Creates instance of validator.
   *
   * @param {object} properties containing supplementary values.
   */
  constructor(properties = {}) {
    Object.assign(this, properties);
  }

  /**
   * Checks that input char sequence is valid.
   *
   * @param {string} charSequence to be validated.
   * @return {boolean} true if charSequence is valid for current use case.
   * @abstract
   */
  isValid(charSequence) {
  }

  /**
   * Is a reverse operation for isValid().
   *
   * @param {string} charSequence to be validated.
   * @return {boolean} true if char sequence if invalid for current use case.
   */
  isInvalid(charSequence) {
    return !this.isValid(charSequence);
  }
}
