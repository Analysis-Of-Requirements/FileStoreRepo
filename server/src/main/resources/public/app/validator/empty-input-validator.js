import AbstractInputValidator from './abstract-input-validator.js';

/**
 * Validates that input sequence is not empty.
 */
export default class EmptyInputValidator extends AbstractInputValidator {

  /**
   * Instantiates EmptyInputValidator.
   *
   * @param {boolean} notEmpty - defines whether input should be empty or not.
   */
  constructor(notEmpty = true) {
    super({notEmpty});
  }

  /**
   * Validates charSequence to be not empty.
   *
   * @param {string} charSequence to be validated.
   * @return {boolean} true if charSequence is not empty.
   * @inheritdoc
   */
  isValid(charSequence) {
    return (charSequence.trim().length !== 0) === this.notEmpty;
  }
}
