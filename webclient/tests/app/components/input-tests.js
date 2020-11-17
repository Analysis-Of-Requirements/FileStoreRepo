import Input from '../../../app/components/input.js';

const {module, test} = QUnit;

export default module('Form Input', (hooks) => {
  let fixture;

  hooks.beforeEach(() => {
    fixture = document.getElementById('qunit-fixture');
  });

  test('should render on page.', (assert) => {
    assert.expect(1);

    new Input(fixture, {
      labelText: 'Login',
      inputId: 'login-input',
      inputName: 'login',
      inputType: 'text',
      inputPlaceholder: 'Email',
    });
    const testData = fixture.querySelector('[data-test=input]');

    assert.ok(testData, 'Should render test data of component.');
  });

  test('should get input value.', (assert) => {
    assert.expect(1);

    const input = new Input(fixture, {
      labelText: 'Login',
      inputId: 'login-input',
      inputName: 'login',
      inputType: 'text',
      inputPlaceholder: 'Email',
    });

    const expectedTestData = 'input stuff';
    let inputElement = fixture.querySelector('input');
    inputElement.value = expectedTestData;
    const actualTestData = input.inputValue;

    assert.equal(actualTestData, expectedTestData, 'Should get input data.');

    inputElement = null;
  });

  test('should display error message.', (assert) => {
    assert.expect(2);

    const input = new Input(fixture, {
      labelText: 'Login',
      inputId: 'login-input',
      inputName: 'login',
      inputType: 'text',
      inputPlaceholder: 'Email',
    });

    const errorMessage = 'this is error message';
    input.showErrorMessage(errorMessage);
    const messageElement = fixture.querySelector('[data-type="error-message"]');
    const actualErrorMessage = messageElement.textContent;

    assert.equal(actualErrorMessage, errorMessage, 'Should show error message.');

    input.hideErrorMessage();
    const emptyErrorMessage = '';
    const actualClearedMessage = messageElement.textContent;

    assert.equal(actualClearedMessage, emptyErrorMessage, 'Should hide error message.');
  });
});
