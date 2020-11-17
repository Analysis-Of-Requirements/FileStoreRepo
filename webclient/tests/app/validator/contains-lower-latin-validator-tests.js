import ContainsLowerLatinValidator from '../../../app/validator/contains-lower-latin-validator.js';

const {module, test} = QUnit;

export default module('Contains Lower Latin Character Validator', () => {

  test('should properly validate input.', (assert) => {
    assert.expect(4);

    const validator = new ContainsLowerLatinValidator();

    const inputWithLowerLatin = '1111h';
    assert.ok(validator.isValid(inputWithLowerLatin), 'Should pass input with lower latin character.');

    const inputOfLowerLatins = 'sas';
    assert.ok(validator.isValid(inputOfLowerLatins), 'Should pass input containing only lower latin characters.');

    const inputOfUpperLatins = 'A';
    assert.notOk(validator.isValid(inputOfUpperLatins), 'Should not pass input with upper latin character.');

    const inputWithoutLowerLatin = '1111ABC';
    assert.notOk(validator.isValid(inputWithoutLowerLatin), 'Should not pass input without lower latin character.');
  });
});
