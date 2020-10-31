import LoginForm from '../components/form/login/login-form.js';
import AbstractFormPage from './abstract-form-page.js';

/**
 * Renders @see {@link LoginForm} inside and sends request on server when form get submitted.
 */
export default class LoginPage extends AbstractFormPage {

  /**
   * Instantiates LoginPage.
   *
   * @param {HTMLElement} container - container of form page.
   * @param {object} properties - configuration properties.
   * @param {function(): void} properties.successfulLoginHandler - handler to execute if login request was successful.
   * @param {TitleService} properties.titleService - title service.
   * @param {ApiService} properties.apiService - api service.
   * @param {ToastService} properties.toastService - toast service.
   */
  constructor(container, {successfulLoginHandler, titleService, apiService, toastService}) {
    super(container, {successfulResponseHandler: successfulLoginHandler, titleService, apiService, toastService});
  }

  /**
   * Render @see {@link LoginForm} inside.
   *
   * @inheritdoc
   */
  initComponent() {
    super.initComponent();
    this.pageTitle = 'Authorization';
  }

  /**
   * @inheritdoc
   */
  initNestedComponents() {
    super.initNestedComponents();
    this.formComponent = new LoginForm(this.rootElement);
  }

  /**
   * @inheritdoc
   */
  _makeRequest(userCredentials) {
    return this.properties.apiService.logIn(userCredentials);
  }
}
