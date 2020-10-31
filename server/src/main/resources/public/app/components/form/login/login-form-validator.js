import FormValidator from '../form-validator.js';

/**
 * Validates login form inputs not to be empty.
 */
export default class LoginFormValidator extends FormValidator {

  /**
   * @inheritdoc
   */
  async validate({login, password}) {
    return Promise.all([
      this.executeValidators(login, {
        notEmpty: {
          value: true,
          errorMessage: 'Login can\'t be empty',
        },
      }),
      this.executeValidators(password, {
        notEmpty: {
          value: true,
          errorMessage: 'Password can\'t be empty',
        },
      }),
    ]);
  }
}
