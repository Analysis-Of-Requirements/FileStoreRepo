/**
 * Value object for form field and input data, associated with it.
 */
export default class ValidationUnit {

  /**
   * Name of the form field.
   *
   * @type {string}
   */
  fieldName;

  /**
   * Input data, associated with the field.
   *
   * @type {string}
   */
  input;

  /**
   * Instantiates ValidationUnit.
   *
   * @param {object} container - object, containing validation data.
   * @param {string} container.inputName - name of the form field.
   * @param {string} container.inputValue - input data, associated with the field.
   */
  constructor({inputName, inputValue}) {
    this.fieldName = inputName;
    this.input = inputValue;
  }
}
