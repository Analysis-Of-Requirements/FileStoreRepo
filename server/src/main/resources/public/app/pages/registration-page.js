import RegistrationForm from '../components/form/registration/registration-form.js';
import AbstractFormPage from './abstract-form-page.js';

/**
 * Renders @see {@link RegistrationForm} inside and sends request on server when form get submitted.
 */
export default class RegistrationPage extends AbstractFormPage {

  /**
   * Instantiates LoginPage.
   *
   * @param {HTMLElement} container - container of form page.
   * @param {object} properties - configuration properties.
   * @param {function(): void} properties.successfulRegistrationHandler - handler to execute if registration request
   * was successful.
   * @param {TitleService} properties.titleService - title service.
   * @param {ApiService} properties.apiService - api service.
   * @param {ToastService} properties.toastService - toast service.
   */
  constructor(container, {successfulRegistrationHandler, titleService, apiService, toastService}) {
    super(container, {
      successfulResponseHandler: successfulRegistrationHandler,
      titleService,
      apiService,
      toastService,
    });
  }

  /**
   * Render @see {@link RegistrationForm} inside.
   *
   * @inheritdoc
   */
  initComponent() {
    super.initComponent();
    this.pageTitle = 'Registration';
  }

  /**
   * @inheritdoc
   */
  initNestedComponents() {
    super.initNestedComponents();
    this.formComponent = new RegistrationForm(this.rootElement);
  }

  /**
   * @inheritdoc
   */
  _makeRequest(userCredentials) {
    return this.properties.apiService.register(userCredentials);
  }
}
