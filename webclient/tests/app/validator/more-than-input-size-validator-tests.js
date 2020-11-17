import MoreThanInputSizeValidator from '../../../app/validator/more-than-input-size-validator.js';

const {module, test} = QUnit;

export default module('More Than Input Size Validator', () => {

  test('should properly validate input.', (assert) => {
    assert.expect(2);

    const size = 3;
    const validator = new MoreThanInputSizeValidator(size);

    const wrongNumberOfCharacters = 'aaa';
    assert.notOk(validator.isValid(wrongNumberOfCharacters),
      'Should not pass input containing less or equal number of elements than specified.');

    const correctNumberOfCharacters = 'aaaa';
    assert.ok(validator.isValid(correctNumberOfCharacters), 'Should pass input with correct number of characters.');
  });
});
