import EmptyInputValidator from '../../../app/validator/empty-input-validator.js';

const {module, test} = QUnit;

export default module('Empty Input Validator', () => {

  test('should properly validate input.', (assert) => {
    assert.expect(6);

    const validator = new EmptyInputValidator();

    const inputWithCharacters = 'aaa';
    assert.ok(validator.isValid(inputWithCharacters), 'Should pass non-empty input containing characters.');

    const emptyInput = '';
    assert.notOk(validator.isValid(emptyInput), 'Should not pass input not containing characters.');

    const spacedInput = '   ';
    assert.notOk(validator.isValid(spacedInput), 'Should not pass empty input of space characters.');

    const newLineInput = '\n';
    assert.notOk(validator.isValid(newLineInput), 'Should not pass empty input of new-line character.');

    const multipleEmptyCharacters = ' \n             \r  \n\n\n \t  ';
    assert.notOk(validator.isValid(multipleEmptyCharacters),
      'Should not pass empty input of multiple spaced characters.');

    const multipleEmptyCharactersWithLatin = ' \n        a     \r  \n\n\n \t  ';
    assert.ok(validator.isValid(multipleEmptyCharactersWithLatin),
      'Should pass input containing at least one non-spaced character.');
  });
});
