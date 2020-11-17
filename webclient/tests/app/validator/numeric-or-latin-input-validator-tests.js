import NumericOrLatinInputValidator from '../../../app/validator/numeric-or-latin-input-validator.js';

const {module, test} = QUnit;

export default module('Numeric Or Latin Input Validator', () => {

  test('should properly validate input.', (assert) => {
    assert.expect(5);

    const validator = new NumericOrLatinInputValidator();

    const inputOfNumbers = "11";
    assert.ok(validator.isValid(inputOfNumbers), 'Should pass input containing only numbers.');

    const inputOfLatins = "ab";
    assert.ok(validator.isValid(inputOfLatins), 'Should pass input containing only latin characters.');

    const latinsAndNumbers = "1ab";
    assert.ok(validator.isValid(latinsAndNumbers), 'Should pass input containing only latins and numbers.');

    const latinsAndNumbersMixed = "1ab%";
    assert.notOk(validator.isValid(latinsAndNumbersMixed),
      'Should not pass input containing non latin or number characters.');

    const noLatinOrNumber = "!#%";
    assert.notOk(validator.isValid(noLatinOrNumber),
      'Should not pass input not containing latins and number characters.');
  });
});
