import AbstractInputValidator from './abstract-input-validator.js';

/**
 * Validates that input sequence is larger than specified number.
 */
export default class MoreThanInputSizeValidator extends AbstractInputValidator {

  /**
   * Creates instance of validator.
   *
   * @param {number} moreThanSize moreThanSize is a lower exclusive number of input sequence length.
   */
  constructor(moreThanSize) {
    super({moreThanSize});
  }

  /**
   * Validates charSequence to be larger than specified number.
   *
   * @param {string} charSequence to be validated.
   * @return {boolean} true if charSequence has more items than specified number.
   * @inheritdoc
   */
  isValid(charSequence) {
    return charSequence.trim().length > this.moreThanSize;
  }
}
