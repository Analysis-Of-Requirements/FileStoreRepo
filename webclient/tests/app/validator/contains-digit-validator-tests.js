import ContainsDigitValidator from '../../../app/validator/contains-digit-validator.js';

const {module, test} = QUnit;

export default module('Contains Digit Validator', () => {

  test('should properly validate input.', (assert) => {
    assert.expect(3);

    const validator = new ContainsDigitValidator();

    const inputWithDigit = 'hello1';
    assert.ok(validator.isValid(inputWithDigit), 'Should pass input with digit.');

    const inputOfDigits = '231';
    assert.ok(validator.isValid(inputOfDigits), 'Should pass input containing only digits.');

    const inputWithoutDigit = 'hello';
    assert.notOk(validator.isValid(inputWithoutDigit), 'Should not pass input without digit.');
  });
});
