import Component from './component.js';

/**
 * Component for rendering input element.
 */
export default class Input extends Component {

  /**
   * Instantiates FormInput component.
   *
   * @param {HTMLElement} container - parent container.
   * @param {object} properties - configuration properties for Anchor component.
   * @param {string} properties.labelText - value of label of the input element.
   * @param {string} properties.inputId - id of input element.
   * @param {string} properties.inputName - name of input element.
   * @param {string} properties.inputType - type of input element.
   * @param {string} properties.inputPlaceholder - placeholder of input component.
   */
  constructor(container,
    {labelText, inputId, inputName, inputType, inputPlaceholder}) {
    super(container, {
      _labelText: labelText,
      _inputId: inputId,
      _inputName: inputName,
      _inputType: inputType,
      _inputPlaceholder: inputPlaceholder,
    });
  }

  /**
   * @inheritdoc
   * @returns {string} markup of input element.
   */
  markup() {
    const {_labelText, _inputName, _inputId, _inputType, _inputPlaceholder} = this.properties;

    return `
      <div class="form-row" data-test="input" data-type="${_inputName}-input-component">
        <label for="${_inputId}">${_labelText}</label>
          
          <div class="input-container">
              <input id="${_inputId}" class="input" name="${_inputName}" type="${_inputType}" 
                  placeholder="${_inputPlaceholder}" data-type="input">
                  
              <div class="error-message" data-type="error-message"></div>
          </div>
      </div>
    `;
  }

  /**
   * Gets value of input element.
   *
   * @return {string} value of input element.
   */
  get inputValue() {
    return this.rootElement.querySelector('[data-type="input"]').value;
  }

  /**
   * Shows error message for the input.
   *
   * @param {string} message to show.
   */
  showErrorMessage(message) {
    this.errorMessageElement.textContent = message;
  }

  /**
   * Hides error message for the input.
   */
  hideErrorMessage() {
    this.errorMessageElement.textContent = '';
  }

  /**
   * Gets error text element.
   *
   * @return {HTMLElement} element, storing error text.
   */
  get errorMessageElement() {
    return this.rootElement.querySelector('[data-type="error-message"]');
  }

  /**
   * Gets label text of input.
   *
   * @return {string} label text.
   */
  get labelText() {
    return this.properties._labelText;
  }

  /**
   * Gets input name of input component.
   *
   * @return {string} input name.
   */
  get inputName() {
    return this.properties._inputName;
  }
}
