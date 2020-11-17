import AbstractInputValidator from './abstract-input-validator.js';

/**
 * Validates input sequence to have at least one lower case latin character.
 */
export default class ContainsLowerLatinValidator extends AbstractInputValidator {

  /**
   * Instantiates ContainsLowerLatinValidator.
   *
   * @param {boolean} shouldContainLowerLatin - defines whether input should contain lower latin chat or not.
   */
  constructor(shouldContainLowerLatin = true) {
    super({shouldContainLowerLatin});
  }

  /**
   * Validates charSequence to have at least one lower-case latin character.
   *
   * @param {string} charSequence to be validated.
   * @return {boolean} true if input contains at least one lower case latin character.
   * @inheritdoc
   */
  isValid(charSequence) {
    return !!charSequence.match(/[a-z]+/) === this.shouldContainLowerLatin;
  }
}
