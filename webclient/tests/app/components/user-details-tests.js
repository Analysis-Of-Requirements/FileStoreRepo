import UserDetails from '../../../app/components/user-details.js';

const {module, test} = QUnit;

export default module('User Details', (hooks) => {

  let fixture;

  hooks.beforeEach(() => {
    fixture = document.getElementById('qunit-fixture');
  });

  test('should render on page.', (assert) => {
    assert.expect(1);

    new UserDetails(fixture, {
      userName: 'John',
    });

    const testData = fixture.querySelector('[data-type=user-details]');
    assert.ok(testData, 'Should render component test data.');
  });

  test('should set user name.', (assert) => {
    assert.expect(1);

    const details = new UserDetails(fixture, {
      userName: '',
    });
    const name = 'mock-name';
    details.userName = name;

    const testData = fixture.querySelector('[data-type="user-name"]');
    assert.strictEqual(testData.textContent, name, 'Should set user name.');
  });

  test('should set loading state.', (assert) => {
    assert.expect(2);

    const details = new UserDetails(fixture, {
      userName: '',
    });
    details.isLoading = true;

    const rootElement = fixture.querySelector('[data-type=user-details]');
    assert.ok(rootElement.classList.contains('loading'), 'Should set user loading state.');

    const testData = rootElement.querySelector('[data-type="user-loading"]');
    assert.strictEqual(testData.textContent, 'Loading...', 'Should set loading text.');
  });

  test('should set error state.', (assert) => {
    assert.expect(2);

    const details = new UserDetails(fixture, {
      userName: '',
    });
    details.isError = true;

    const rootElement = fixture.querySelector('[data-type=user-details]');
    assert.ok(rootElement.classList.contains('error'), 'Should set user loading error state.');

    const testData = rootElement.querySelector('[data-type="user-error"]');
    assert.strictEqual(testData.textContent, 'Error occurred while loading user.', 'Should set loading text.');
  });
});
