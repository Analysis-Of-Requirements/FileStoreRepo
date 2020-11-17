import Component from '../component.js';
import Anchor from '../anchor.js';

/**
 * Component for rendering form element.
 * @abstract
 */
export default class Form extends Component {

  /**
   * Instantiates Form component.
   *
   * @param {HTMLElement} container - parent container.
   * @param {object} properties - configuration properties of the component.
   * @param {string} properties.headerText - header of the form.
   * @param {FormValidator} properties.formValidator - form delegates validation to formValidator.
   */
  constructor(container, {headerText = 'Form', formValidator} = {}) {
    super(container, {headerText, formValidator});
  }

  /**
   * @name SubmitEventHandler
   * @function
   * @param {ValidationUnit[]} - array of field-input pairs.
   */

  /**
   * Handlers for click event.
   *
   * @type {SubmitEventHandler[]}
   * @private
   */
  _onSubmitHandlers = [];

  /**
   * @inheritdoc
   */
  initComponent() {
    const containerClass = this.container.getAttribute('class');
    this.container.setAttribute('class', `${containerClass} form-box`);
    super.initComponent();
  }

  /**
   * @inheritdoc
   */
  initNestedComponents() {
    const logoContainer = this.rootElement.querySelector('[data-type="logo-component"]');
    const innerImage = '<img src="images/filestore.png" alt="FileStore">';
    new Anchor(logoContainer, {
      className: 'logo',
      anchorReference: '#',
      target: '_self',
      title: 'FileStore',
      innerContent: innerImage,
    });
  }

  /**
   * @inheritdoc
   */
  addEventListeners() {
    this.submitButton.addClickHandler((event) => {
      event.preventDefault();
      event.stopPropagation();
      this._validateForm();
    });
  }

  /**
   * Validates form and handles validation result.
   * @private
   */
  _validateForm() {
    const validationUnits = this._collectValidationUnits();
    this.hideErrorMessages();

    this.properties.formValidator.validate(validationUnits)
      .then(() => {
        this._handleSubmitEvent();
      })
      .catch((errorCase) => {
        this.resolveValidationFailure([errorCase]);
      });
  }

  /**
   * Collects input data from form and transforms it into an object, containing ValidationUnits.
   *
   * @return {Object.<string, ValidationUnit>} collected validation units.
   * @abstract
   * @private
   */
  _collectValidationUnits() {

  }

  /**
   * Hides error messages on the form input components.
   */
  hideErrorMessages() {
    this.inputComponents.forEach((component) => component.hideErrorMessage());
  }

  /**
   * Adds handler for form's submit event.
   *
   * @param {SubmitEventHandler} handler - function will execute when 'submit' event of the form triggers.
   */
  onSubmit(handler) {
    this._onSubmitHandlers.push(handler);
  }

  /**
   * Executes submit event handlers.
   * @private
   */
  _handleSubmitEvent() {
    this._onSubmitHandlers.forEach((handler) => handler());
  }

  /**
   * Handles validation error case.
   *
   * @param {ValidationErrorCase[]} errorCases - field-message pairs, containing descriptive info about errors.
   */
  resolveValidationFailure(errorCases) {
    this.inputComponents.forEach((component) => {
      const {inputName} = component;
      const errorCase = errorCases.find((errorCase) => errorCase.field === inputName);

      if (errorCase) {
        component.showErrorMessage(errorCase.message);
      }
    });
  }

  /**
   * Resolves authentication error.
   *
   * @param {AuthenticationError} error - authentication error.
   */
  showAuthenticationError(error) {
    this.inputComponents[0].showErrorMessage(error.message);
  }
}
