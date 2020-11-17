import RegistrationPage from '../../../app/pages/registration-page.js';

const {module, test} = QUnit;

export default module('Registration Page', (hooks) => {
  let fixture;

  hooks.beforeEach(() => {
    fixture = document.getElementById('qunit-fixture');
  });

  test('should render page content.', (assert) => {
    assert.expect(1);

    const titleService = {
      setPage() {
      },
    };

    new RegistrationPage(fixture, {
      successfulResponseHandler: null,
      titleService,
      apiService: null,
    });

    const testData = fixture.querySelector('[data-test="form-page"]');
    assert.ok(testData, 'Should load test data of component.');
  });

  test('should change tab title.', (assert) => {
    assert.expect(2);

    const titleService = {
      setPage(page) {
        assert.step(`Page title is set: ${page}.`);
      },
    };

    new RegistrationPage(fixture, {
      successfulResponseHandler: null,
      titleService,
      apiService: null,
    });

    assert.verifySteps(['Page title is set: Registration.'], 'Should properly set page title.');
  });

  test('should make registration request.', (assert) => {
    assert.expect(3);
    const done = assert.async();

    const token = 'mock-token';
    const apiService = {
      async register(credentials) {
        assert.step(`Should make registration request. Login: '${credentials.login}'. Password: '${credentials.password}'.`);
        return Promise.resolve({token});
      },
    };

    const successfulRegistrationHandler = () => {
      assert.step('Should execute handler when request succeeded.');

      assert.verifySteps([
        'Should make registration request. Login: \'admin\'. Password: \'qwerty123A\'.',
        'Should execute handler when request succeeded.',
      ], 'Should handle registration request.');
    };

    const titleService = {
      setPage() {
      },
    };

    new RegistrationPage(fixture, {
      successfulRegistrationHandler,
      titleService,
      apiService,
    });

    const loginInput = fixture
      .querySelector('[data-type="login-input-component"] [data-type="input"]');
    loginInput.value = 'admin';
    const passwordInput = fixture.querySelector('[data-type="password-input-component"] [data-type="input"]');
    passwordInput.value = 'qwerty123A';
    const confirmPasswordInput = fixture
      .querySelector('[data-type="confirmPassword-input-component"] [data-type="input"]');
    confirmPasswordInput.value = 'qwerty123A';

    const submitButton = fixture.querySelector('[data-type="button-component"] [data-test="button"]');
    submitButton.click();
    done();
  });
});
