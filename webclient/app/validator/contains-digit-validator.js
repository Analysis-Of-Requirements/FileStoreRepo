import AbstractInputValidator from './abstract-input-validator.js';

/**
 * Validates input sequence to have at least one digit character.
 */
export default class ContainsDigitValidator extends AbstractInputValidator {

  /**
   * Instantiates ContainsDigitValidator.
   *
   * @param {boolean} shouldContainDigit - defines whether input should contain digit or not.
   */
  constructor(shouldContainDigit = true) {
    super({shouldContainDigit});
  }

  /**
   * Validates charSequence to have at least one digit character.
   *
   * @param {string} charSequence to be validated.
   * @return {boolean} true if input contains at least one digit character.
   * @inheritdoc
   */
  isValid(charSequence) {
    return !!charSequence.match(/[0-9]+/) === this.shouldContainDigit;
  }
}
