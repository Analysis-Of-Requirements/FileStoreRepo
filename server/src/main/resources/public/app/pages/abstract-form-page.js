import Component from '../components/component.js';
import UserCredentials from '../models/user-credentials.js';
import ServerValidationError from '../models/errors/server-validation-error.js';
import GeneralServerError from '../models/errors/general-server-error.js';
import AuthenticationError from '../models/errors/authentication-error.js';

/**
 * Adds-on for form component.
 * Can send requests, handle responses and redirect on other pages.
 * Renders form component inside.
 * @abstract
 */
export default class AbstractFormPage extends Component {

  /**
   * Initializes Form Page.
   *
   * @param {HTMLElement} container - container of form page.
   * @param {object} properties - configuration properties.
   * @param {function(): void} properties.successfulResponseHandler - handler to execute if page's response was
   * successful.
   * @param {TitleService} properties.titleService - title service.
   * @param {ApiService} properties.apiService - api service.
   * @param {ToastService} properties.toastService - toast service.
   */
  constructor(container, {successfulResponseHandler, titleService, apiService, toastService}) {
    super(container, {successfulResponseHandler, titleService, apiService, toastService});
  }

  /**
   * Sets page title. Title will be displayed on the browser tab.
   *
   * @param {string} title - title of the page.
   */
  set pageTitle(title) {
    this.properties.titleService.setPage(title);
  }

  /**
   * @inheritdoc
   * @return {string} - root element.
   */
  markup() {
    return `
      <div class="application-box" data-type="application-box" data-test="form-page"></div>
    `;
  }

  /**
   * Registers 'submit' handler.
   * If primary validation of client input fails - stop and don't go further.
   * Otherwise - make request in server and handle response.
   */
  addEventListeners() {
    const {formComponent} = this;

    formComponent.onSubmit(() => {
      const {passwordComponent, loginComponent} = formComponent;
      const login = loginComponent.inputValue;
      const password = passwordComponent.inputValue;
      const userCredentials = new UserCredentials(login, password);

      formComponent.hideErrorMessages();

      return this._makeRequest(userCredentials)
        .then(() => {
          this._handleSuccessfulResponse();
        })
        .catch((responseError) => {
          this._handleResponseError(responseError);
        });
    });
  }

  /**
   * Handles errors, that may be in server response.
   *
   * @param {Error} responseError - server response error.
   * @private
   */
  _handleResponseError(responseError) {
    if (responseError instanceof ServerValidationError) {
      this._handleServerValidationError(responseError);
    } else if (responseError instanceof GeneralServerError) {
      this.properties.toastService.showError('General Server Error');
    } else if (responseError instanceof AuthenticationError) {
      this._handleAuthenticationError(responseError);
    } else {
      this.properties.toastService.showError('Unrecognised error.');
    }
  }

  /**
   * Handles server validation error.
   *
   * @param {ServerValidationError} validationError - validation error, occurred on server.
   * @private
   */
  _handleServerValidationError(validationError) {
    const {formComponent} = this;
    const fieldNames = ['login', 'password', 'confirmPassword'];
    const errorCases = fieldNames
      .filter((field) => validationError.hasErrorCase(field))
      .map((field) => validationError.getErrorCase(field));
    formComponent.resolveValidationFailure(errorCases);
  }

  /**
   * Handles authentication error.
   *
   * @param {AuthenticationError} authenticationError - error occurred when identifying user on server.
   * @private
   */
  _handleAuthenticationError(authenticationError) {
    this.formComponent.showAuthenticationError(authenticationError);
  }

  /**
   * Makes request on server with given user credentials.
   * Specific behaviour must be defined by inheritors.
   *
   * @param {UserCredentials} userCredentials - login and password input.
   * @return {Promise} with response.
   * @private
   * @abstract
   */
  _makeRequest(userCredentials) {

  }

  /**
   * Handler of successful response.
   * @private
   */
  _handleSuccessfulResponse() {
    this.properties.successfulResponseHandler();
  }
}
