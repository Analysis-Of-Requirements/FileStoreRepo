import Input from '../../input.js';
import LoginFormValidator from './login-form-validator.js';
import Button from '../../button.js';
import Anchor from '../../anchor.js';
import Form from '../form.js';
import ValidationUnit from '../../../models/validation-unit.js';

/**
 * LogIn Form Component.
 */
export default class LoginForm extends Form {

  /**
   * Instantiates LoginForm component.
   *
   * @param {HTMLElement} container - parent container.
   * @param {object} properties - configuration properties of the component.
   * @param {string} properties.headerText - header of the form.
   * @param {FormValidator} properties.formValidator - form delegates validation to formValidator.
   */
  constructor(container, {
    headerText = 'Login',
    formValidator = new LoginFormValidator(),
  } = {}) {
    super(container, {headerText, formValidator});
  }

  /**
   * @inheritdoc
   * @return {string} markup of <form> element.
   */
  markup() {
    const {headerText} = this.properties;
    return `
        <div>
            <div data-type="logo-component"></div>
            
            <header class="header">
                <span class="glyphicon glyphicon-user"></span>
                <h1>${headerText}</h1>
            </header>
            
            <hr>
            
            <form data-test="form">
                <div data-type="input-components"></div>
                
                <div class="form-row">
                    <div class="input-container">
                        <span data-type="anchor-component"></span>
                        <span data-type="button-component"></span>
                    </div>
                </div>            
            </form>
        </div>
    `;
  }

  /**
   * Initializes nested ui components and form validator.
   * @inheritdoc
   */
  initNestedComponents() {
    super.initNestedComponents();
    const {rootElement} = this;
    const inputElementsContainer = rootElement.querySelector('[data-type="input-components"]');
    inputElementsContainer.setAttribute('data-test', 'login-form-rendered');

    this.loginComponent = new Input(inputElementsContainer, {
      labelText: 'Login',
      inputId: 'login-input',
      inputName: 'login',
      inputType: 'text',
      inputPlaceholder: 'Email',
    });

    this.passwordComponent = new Input(inputElementsContainer, {
      labelText: 'Password',
      inputId: 'password-input',
      inputName: 'password',
      inputType: 'password',
      inputPlaceholder: 'Password',
    });

    this.inputComponents = [this.loginComponent, this.passwordComponent];

    const buttonContainer = rootElement.querySelector('[data-type="button-component"]');
    this.submitButton = new Button(buttonContainer, {
      type: 'submit',
      textContent: 'Login',
      title: 'Login',
    });

    const anchorContainer = rootElement.querySelector('[data-type="anchor-component"]');
    new Anchor(anchorContainer, {
      anchorReference: '#/registration',
      target: '_self',
      innerContent: 'Don\'t have an account yet?',
      title: 'Register',
    });
  }

  /**
   * @inheritdoc
   */
  _collectValidationUnits() {
    const {loginComponent, passwordComponent} = this;

    return {
      [loginComponent.inputName]: new ValidationUnit(loginComponent),
      [passwordComponent.inputName]: new ValidationUnit(passwordComponent),
    };
  }
}
