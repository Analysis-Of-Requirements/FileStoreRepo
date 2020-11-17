import ValidationErrorCase from '../../models/errors/validation-error-case.js';
import MoreThanInputSizeValidator from '../../validator/more-than-input-size-validator.js';
import NumericOrLatinInputValidator from '../../validator/numeric-or-latin-input-validator.js';
import ContainsLowerLatinValidator from '../../validator/contains-lower-latin-validator.js';
import ContainsDigitValidator from '../../validator/contains-digit-validator.js';
import ContainsUpperLatinValidator from '../../validator/contains-upper-latin-validator.js';
import ConfirmPasswordValidator from '../../validator/confirm-password-validator.js';
import EmptyInputValidator from '../../validator/empty-input-validator.js';

/**
 * Component for validation form inputs.
 * Must be inherited by specific form-type validation components.
 * @abstract
 */
export default class FormValidator {

  /**
   * @typedef {Object} ValidationRule - rule, according to which validation will be done.
   * @param {*} value - value or flag, which supports validation .
   * @param {string} errorMessage - error message to show when failed validation.
   */

  /**
   * Validates form inputs and returns Promise: rejected if form was not validated and resolved otherwise.
   *
   * @param {Object.<string, ValidationUnit>} validationUnits - units to validate.
   * @return {Promise<*, ValidationErrorCase>} promise with result of validation.
   * @abstract
   */
  async validate(validationUnits) {

  }

  /**
   * Validates validation units by specified rules.
   *
   * @param {ValidationUnit} validationUnit - contains information about field and it's input.
   * @param {Object.<string, ValidationRule>} validationRules - map of rules of how validation should be done.
   * @return {Promise<*, ValidationErrorCase>} promise is resolved if input passed or rejected if found error.
   */
  async executeValidators({input, fieldName}, validationRules) {
    const parsedValidationRules = this._parseValidationRules(validationRules);

    return new Promise((resolve, reject) => {
      parsedValidationRules.forEach(({errorMessage, validator}) => {
        if (validator.isInvalid(input)) {
          return reject(
            new ValidationErrorCase({
              field: fieldName,
              message: errorMessage,
            }),
          );
        }
      });

      return resolve();
    });
  }

  /**
   * Retrieves list of validators, mapped to validation rules.
   *
   * @param {Object.<string, ValidationRule>} validationRules - map of rules of how validation should be done.
   * @return {{validator: AbstractInputValidator, errorMessage: string}[]} - array of mapped validators and error
   * messages.
   * @private
   */
  _parseValidationRules(validationRules) {
    const validatorConstructors = {
      notEmpty: EmptyInputValidator,
      moreThanSize: MoreThanInputSizeValidator,
      numericOrLatinInput: NumericOrLatinInputValidator,
      containsLowerLatin: ContainsLowerLatinValidator,
      containsDigit: ContainsDigitValidator,
      containsUpperLatin: ContainsUpperLatinValidator,
      confirmPassword: ConfirmPasswordValidator,
    }

    return Object.entries(validationRules).map(([ruleName, {value, errorMessage}]) => {
      const Validator = validatorConstructors[ruleName];
      return {
        validator: new Validator(value),
        errorMessage,
      };
    });
  }
}
