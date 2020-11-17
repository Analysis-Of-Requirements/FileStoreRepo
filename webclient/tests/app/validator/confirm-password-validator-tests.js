import ConfirmPasswordValidator from '../../../app/validator/confirm-password-validator.js';

const {module, test} = QUnit;

export default module('Confirm Password Validator', () => {

  test('should properly validate input.', (assert) => {
    assert.expect(3);

    const passwordToCompare = 'hello';
    const validator = new ConfirmPasswordValidator(passwordToCompare);
    const confirmationPassword = passwordToCompare;
    const wrongPassword = 'bye';

    assert.ok(validator.isValid(confirmationPassword), 'Should pass matched password.');
    assert.notOk(validator.isValid(wrongPassword), 'Should not pass wrongly-typed password.');
    assert.notOk(validator.isInvalid(confirmationPassword), 'isInvalid() should return false for matched password.');
  });
});
