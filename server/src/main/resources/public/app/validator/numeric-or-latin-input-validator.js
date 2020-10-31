import AbstractInputValidator from './abstract-input-validator.js';

/**
 * Validates input sequence to contain only Latin characters and numbers.
 */
export default class NumericOrLatinInputValidator extends AbstractInputValidator {

  /**
   * Instantiates NumericOrLatinInputValidator.
   *
   * @param {boolean} shouldContainNumbersAndLatinsOnly - defines whether input should contain only numbers and latin
   * characters.
   */
  constructor(shouldContainNumbersAndLatinsOnly = true) {
    super({shouldContainNumbersAndLatinsOnly});
  }

  /**
   * Validates input sequence to contain only Latin characters and numbers.
   *
   * @param {string} charSequence to be validated.
   * @return {boolean} true if charSequence contains only Latin characters and numbers.
   * @inheritdoc
   */
  isValid(charSequence) {
    return !!charSequence.match(/^[a-zA-Z0-9]*$/) === this.shouldContainNumbersAndLatinsOnly;
  }
}
