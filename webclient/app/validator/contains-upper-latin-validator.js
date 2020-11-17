import AbstractInputValidator from './abstract-input-validator.js';

/**
 * Validates input sequence to have at least one upper case latin character.
 */
export default class ContainsUpperLatinValidator extends AbstractInputValidator {

  /**
   * Instantiates ContainsUpperLatinValidator.
   *
   * @param {boolean} shouldContainUpperLatin - defines whether input should contain upper latin chat or not.
   */
  constructor(shouldContainUpperLatin = true) {
    super({shouldContainUpperLatin});
  }

  /**
   * Validates charSequence to have at least one upper-case latin character.
   *
   * @param {string} charSequence to be validated.
   * @return {boolean} true if input contains at least one upper case latin character.
   * @inheritdoc
   */
  isValid(charSequence) {
    return !!charSequence.match(/[A-Z]+/) === this.shouldContainUpperLatin;
  }
}
