import Input from '../../input.js';
import RegistrationFormValidator from './registration-form-validator.js';
import Button from '../../button.js';
import Anchor from '../../anchor.js';
import Form from '../form.js';
import ValidationUnit from '../../../models/validation-unit.js';

/**
 * Registration form.
 */
export default class RegistrationForm extends Form {

    /**
     * Instantiates RegistrationForm component.
     *
     * @param {HTMLElement} container - parent container.
     * @param {object} properties - configuration properties of the component.
     * @param {string} properties.headerText - header of the form.
     * @param {FormValidator} properties.formValidator - form delegates validation to formValidator.
     */
    constructor(container, {
        headerText = 'Registration',
        formValidator = new RegistrationFormValidator(),
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
        const inputComponentsContainer = rootElement.querySelector('[data-type="input-components"]');
        inputComponentsContainer.setAttribute("data-test", "registration-form");

        this.loginComponent = new Input(inputComponentsContainer, {
            labelText: 'Login',
            inputId: 'login-input',
            inputName: 'login',
            inputType: 'text',
            inputPlaceholder: 'Email',
        });

        this.passwordComponent = new Input(inputComponentsContainer, {
            labelText: 'Password',
            inputId: 'password-input',
            inputName: 'password',
            inputType: 'password',
            inputPlaceholder: 'Password',
        });

        this.confirmPasswordComponent = new Input(inputComponentsContainer, {
            labelText: 'Confirm password',
            inputId: 'confirm-password-input',
            inputName: 'confirmPassword',
            inputType: 'password',
            inputPlaceholder: 'Confirm password',
        });

        this.inputComponents = [this.loginComponent, this.passwordComponent, this.confirmPasswordComponent];

        const buttonContainer = rootElement.querySelector('[data-type="button-component"]');
        this.submitButton = new Button(buttonContainer, {
            type: 'submit',
            textContent: 'Register',
            title: 'Registration',
        });

        const anchorContainer = rootElement.querySelector('[data-type="anchor-component"]');
        new Anchor(anchorContainer, {
            anchorReference: `#/login`,
            target: '_self',
            innerContent: 'Already have an account?',
            title: 'Log In',
        });
    }

    /**
     * @inheritdoc
     */
    _collectValidationUnits() {
        const {loginComponent, passwordComponent, confirmPasswordComponent} = this;

        return {
            [loginComponent.inputName]: new ValidationUnit(loginComponent),
            [passwordComponent.inputName]: new ValidationUnit(passwordComponent),
            [confirmPasswordComponent.inputName]: new ValidationUnit(confirmPasswordComponent),
        };
    }
}
