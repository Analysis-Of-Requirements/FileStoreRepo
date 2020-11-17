import ContainsUpperLatinValidator from '../../../app/validator/contains-upper-latin-validator.js';

const {module, test} = QUnit;

export default module('Contains Upper Latin Character Validator', () => {

  test('should properly validate input.', (assert) => {
    assert.expect(4);

    const validator = new ContainsUpperLatinValidator();

    const inputWithUpperLatin = '1111H';
    assert.ok(validator.isValid(inputWithUpperLatin), 'Should pass input with upper latin character.');

    const inputOfUpperLatins = 'SAS';
    assert.ok(validator.isValid(inputOfUpperLatins), 'Should pass input containing only upper latin characters.');

    const inputOfLowerLatins = 'a';
    assert.notOk(validator.isValid(inputOfLowerLatins), 'Should not pass input of lower latin characters.');

    const inputWithoutUpperLatin = '1111abc';
    assert.notOk(validator.isValid(inputWithoutUpperLatin), 'Should not pass input without upper latin character.');
  });
});
