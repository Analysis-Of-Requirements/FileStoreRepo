import AbstractInputValidator from './abstract-input-validator.js';

/**
 * Validates that 'confirm password' value is equal to 'password' value.
 */
export default class ConfirmPasswordValidator extends AbstractInputValidator {

  /**
   * Instantiates validator.
   *
   * @param {string} passwordToCompare - input value of to be compared with confirm password value.
   */
  constructor(passwordToCompare) {
    super({passwordToCompare});
  }

  /**
   * Validates charSequence value to be equal by length and content to password value.
   *
   * @param {string} charSequence to be validated.
   * @return {boolean} true if values match.
   * @inheritdoc
   */
  isValid(charSequence) {
    return charSequence === this.passwordToCompare;
  }
}
