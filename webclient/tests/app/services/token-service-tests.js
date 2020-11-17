import TokenService from '../../../app/services/token-service.js';

const {module, test} = QUnit;

export default module('Token Service', () => {

  test('should set token.', (assert) => {
    assert.expect(2);

    const localStorage = new LocalStorageMock(assert);
    const tokenService = new TokenService(localStorage);
    const token = 'token-mock';
    tokenService.setToken(token);

    assert.verifySteps([`Should set token to storage: ${token}.`], 'Should set token to local storage.');
  });

  test('should retrieve token.', (assert) => {
    assert.expect(4);

    const token = 'token-mock';
    const localStorage = new LocalStorageMock(assert);
    const tokenService = new TokenService(localStorage);
    tokenService.setToken(token);
    const actualToken = tokenService.getToken();

    assert.strictEqual(actualToken, token, 'Actual token should be equal to token from the storage.');
    assert.verifySteps([
      `Should set token to storage: ${token}.`,
      'Should get token from storage.',
    ], 'Should retrieve token from local storage.');
  });

  test('should return null if token is not set.', (assert) => {
    assert.expect(3);

    const localStorage = new LocalStorageMock(assert);
    const tokenService = new TokenService(localStorage);
    const actualToken = tokenService.getToken();

    assert.strictEqual(actualToken, null, 'Actual token should be \'null\' if it was not set into the service before.');
    assert.verifySteps(['Should get token from storage.'], 'Should return null if token doesn\'t exist.');
  });

  test('should delete token.', (assert) => {
    assert.expect(4);

    const localStorage = new LocalStorageMock(assert);
    const tokenService = new TokenService(localStorage);
    tokenService.deleteToken();
    const actualToken = tokenService.getToken();

    assert.strictEqual(actualToken, null, 'Actual token should be \'null\' after storage was cleared.');
    assert.verifySteps([
      'Should delete token from storage.',
      'Should get token from storage.',
    ], 'Should clear storage after deleteToken() is called.');
  });
});

/**
 * Mock for Local Storage.
 */
class LocalStorageMock {

  /**
   * Instantiates LocalStorageMock.
   *
   * @param {Qunit.assert} assert - assertions object.
   */
  constructor(assert) {
    this.assert = assert;
    this._token = null;
  }

  /**
   * @inheritdoc
   */
  getItem() {
    this.assert.step('Should get token from storage.');

    return this._token;
  }

  /**
   * @inheritdoc
   */
  setItem(key, value) {
    this.assert.step(`Should set token to storage: ${value}.`);
    this._token = value;
  }

  /**
   * @inheritdoc
   */
  clear() {
    this.assert.step('Should delete token from storage.');
    this._token = null;
  }
}
