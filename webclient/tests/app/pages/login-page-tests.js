import LoginPage from '../../../app/pages/login-page.js';

const {module, test} = QUnit;

export default module('Login Page', (hooks) => {
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

    new LoginPage(fixture, {
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

    new LoginPage(fixture, {
      successfulResponseHandler: null,
      titleService,
      apiService: null,
    });

    assert.verifySteps(['Page title is set: Authorization.'], 'Should properly set page title.');
  });

  test('should make log-in request.', (assert) => {
    assert.expect(3);
    const done = assert.async();

    const token = 'mock-token';
    const apiService = {
      async logIn(credentials) {
        assert.step(`Should make log in request. Login: '${credentials.login}'. Password: '${credentials.password}'.`);
        return Promise.resolve({token});
      },
    };

    const successfulLoginHandler = () => {
      assert.step('Should execute handler when request succeeded.');

      assert.verifySteps([
        'Should make log in request. Login: \'admin\'. Password: \'qwerty123A\'.',
        'Should execute handler when request succeeded.',
      ], 'Should handle log-in request.');
    };

    const titleService = {
      setPage() {
      },
    };

    new LoginPage(fixture, {
      successfulLoginHandler,
      titleService,
      apiService,
    });

    const loginInput = fixture.querySelector('[data-type="login-input-component"] [data-type="input"]');
    loginInput.value = 'admin';
    const passwordInput = fixture.querySelector('[data-type="password-input-component"] [data-type="input"]');
    passwordInput.value = 'qwerty123A';

    const submitButton = fixture.querySelector('[data-type="button-component"] [data-test="button"]');
    submitButton.click();
    done();
  });
});
