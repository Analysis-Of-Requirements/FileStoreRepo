import FormValidator from '../form-validator.js';

/**
 * Validates each input component of registration form separately: each one has it's own list of validators.
 * Components are validated as follows: login -> password -> confirm password.
 * If some was not validated -> show error message and stop validating.
 * If all passed -> return promise.
 */
export default class RegistrationFormValidator extends FormValidator {

  /**
   * @inheritdoc
   */
  async validate({login, password, confirmPassword}) {
    const loginRules = {
      moreThanSize: {
        value: 3,
        errorMessage: 'Login should be not less than 3 characters long.',
      },
      numericOrLatinInput: {
        value: true,
        errorMessage: 'Login should contain only numbers and latin characters.',
      },
    };
    const passwordRules = {
      moreThanSize: {
        value: 7,
        errorMessage: 'Password should be at least 8 characters long.',
      },
      numericOrLatinInput: {
        value: true,
        errorMessage: 'Password should contain only numbers and latin characters.',
      },
      containsLowerLatin: {
        value: true,
        errorMessage: 'Password should contain at least one lower latin character.',
      },
      containsDigit: {
        value: true,
        errorMessage: 'Password should contain at least one digit.',
      },
      containsUpperLatin: {
        value: true,
        errorMessage: 'Password should contain at least one upper latin character.',
      },
    };
    const confirmPasswordRules = {
      confirmPassword: {
        value: password.input,
        errorMessage: `Confirmation password must be equal to password.`,
      },
    };

    return Promise.all([
      this.executeValidators(login, loginRules),
      this.executeValidators(password, passwordRules),
      this.executeValidators(confirmPassword, confirmPasswordRules),
    ]);
  }
}
