import RegistrationForm from '../../../../../app/components/form/registration/registration-form.js';

const {module, test} = QUnit;

export default module('Registration Form', () => {
  let fixture = document.getElementById('qunit-fixture');

  test('should render on page.', (assert) => {
    assert.expect(1);
    new RegistrationForm(fixture, {
      headerText: '',
    });
    const testData = fixture.querySelector('[data-test=registration-form]');
    assert.ok(testData, 'Should load test data of component.');
  });
});
