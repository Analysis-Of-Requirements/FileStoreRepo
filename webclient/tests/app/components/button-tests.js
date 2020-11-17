import Button from '../../../app/components/button.js';

const {module, test} = QUnit;

export default module('Button', (hooks) => {
  let fixture;

  hooks.beforeEach(() => {
    fixture = document.getElementById('qunit-fixture');
  });

  test("should render on page.", (assert) => {
    assert.expect(1);

    new Button(fixture, {
      type: 'submit',
      textContent: 'button-text',
    });

    const testData = fixture.querySelector("[data-test=button]");
    assert.ok(testData, "Should render component test data.");
  });

  test("should render loading state.", (assert) => {
    assert.expect(1);

    new Button(fixture, {
      isLoading: true,
    });

    const buttonElement = fixture.querySelector('[data-test="button"]');
    assert.ok(buttonElement.classList.contains('loading'), 'Should render button with loading state.');
  });

  test("should set loading state.", (assert) => {
    assert.expect(3);

    const button = new Button(fixture, {
      isLoading: false,
    });

    let buttonElement = fixture.querySelector('[data-test="button"]');
    assert.ok(!buttonElement.classList.contains('loading'), 'Should not initialize button with loading state.');

    button.isLoading = true;
    buttonElement = fixture.querySelector('[data-test="button"]');
    assert.ok(buttonElement.classList.contains('loading'), 'Should render button with loading state.');
    assert.ok(button.isLoading, 'Should set loading state to button.');
  });
});
