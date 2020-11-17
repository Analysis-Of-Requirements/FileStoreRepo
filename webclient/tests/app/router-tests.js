import Router from '../../app/router.js';

const {module, test} = QUnit;

export default module('Router', (hooks) => {
  let fixture;

  hooks.beforeEach(() => {
    fixture = document.getElementById('qunit-fixture');
  });

  test('should properly initialize', (assert) => {
    assert.expect(9);

    const windowMock = new WindowMock(assert);
    fixture.innerHTML = 'mock-html-content';
    const defaultUrlHash = '/login';
    const pageMappings = {
      [defaultUrlHash]: () => assert.step('Should call page creator.'),
    };
    const hashChangeHandler = (staticPart, dynamicPart) => {
      assert.step('Should trigger hash-changed handler.');
      assert.strictEqual(staticPart, defaultUrlHash, 'Should properly parse static part of the url.');
      assert.deepEqual(dynamicPart, {}, 'Should properly parse dynamic part of the url.');
    };
    new Router(windowMock, fixture, pageMappings, defaultUrlHash, null, [hashChangeHandler]);

    assert.verifySteps([
      'Should get hash from window: .',
      `Should set hash to Window: #${defaultUrlHash}.`,
      'Should get hash from window: #/login.',
      'Should call page creator.',
      'Should trigger hash-changed handler.',
    ], 'Should properly initialize when initial url route is not defined.');

    assert.strictEqual(fixture.innerHTML, '', 'Should clear html content of page container.');
  });

  test('should handle initially-set url.', (assert) => {
    assert.expect(5);

    const defaultUrlHash = '/login';
    const windowMock = new WindowMock(assert, defaultUrlHash);
    const pageMappings = {
      [defaultUrlHash]: () => assert.step('Should call page creator.'),
    };
    const hashChangeHandler = (staticPart, dynamicPart) => {
      assert.step(`Should trigger hash-changed handler. Hash: ${staticPart}.`);
      assert.deepEqual(dynamicPart, {}, 'Should properly parse dynamic part of the url.');
    };
    new Router(windowMock, fixture, pageMappings, defaultUrlHash, null, [hashChangeHandler]);

    assert.verifySteps([
      `Should get hash from window: #${defaultUrlHash}.`,
      'Should call page creator.',
      `Should trigger hash-changed handler. Hash: ${defaultUrlHash}.`,
    ], 'Should properly handle case when url is set.');
  });

  test('should handle initial not-existing url.', (assert) => {
    assert.expect(5);

    const notExistingUrlHash = '/not-existing';
    const windowMock = new WindowMock(assert, notExistingUrlHash);
    const defaultUrlHash = '/login';
    const pageMappings = {
      [defaultUrlHash]: () => assert.ok(false, 'Should not call page creator.'),
    };
    const notFoundPageHandler = () => assert.step('Should call not-found-page creator.');
    const hashChangeHandler = (staticPart, dynamicPart) => {
      assert.step(`Should trigger hash-changed handler. Hash: ${staticPart}.`);
      assert.deepEqual(dynamicPart, {}, 'Should properly parse dynamic part of the url.');
    };
    new Router(windowMock, fixture, pageMappings, defaultUrlHash, notFoundPageHandler, [hashChangeHandler]);

    assert.verifySteps([
      `Should get hash from window: #${notExistingUrlHash}.`,
      'Should call not-found-page creator.',
      `Should trigger hash-changed handler. Hash: ${notExistingUrlHash}.`,
    ], 'Should properly handle case when not-existing url is set.');
  });

  test('should redirect to existing url.', (assert) => {
    assert.expect(10);

    const defaultUrlHash = '/login';
    const secondUrlHash = '/registration';
    const windowMock = new WindowMock(assert, defaultUrlHash);
    const pageMapping = {
      [defaultUrlHash]: () => assert.step(`Should call ${defaultUrlHash} page creator.`),
      [secondUrlHash]: () => assert.step(`Should call ${secondUrlHash} page creator.`),
    };
    const hashChangeHandler = (staticPart, dynamicPart) => {
      assert.step(`Should trigger hash-changed handler. Hash: ${staticPart}.`);
      assert.deepEqual(dynamicPart, {}, 'Should properly parse dynamic part of the url.');
    };
    const router = new Router(windowMock, fixture, pageMapping, defaultUrlHash, null, [hashChangeHandler]);
    router.redirectTo(secondUrlHash);

    assert.verifySteps([
      `Should get hash from window: #${defaultUrlHash}.`,
      `Should call ${defaultUrlHash} page creator.`,
      `Should trigger hash-changed handler. Hash: ${defaultUrlHash}.`,
      `Should set hash to Window: #${secondUrlHash}.`,
      `Should get hash from window: #${secondUrlHash}.`,
      `Should call ${secondUrlHash} page creator.`,
      `Should trigger hash-changed handler. Hash: ${secondUrlHash}.`,
    ], 'Should redirect to another registered url.');
  });

  test('should redirect to the same url.', (assert) => {
    assert.expect(10);

    const defaultUrlHash = '/login';
    const windowMock = new WindowMock(assert, defaultUrlHash);
    const pageMapping = {
      [defaultUrlHash]: () => assert.step(`Should call ${defaultUrlHash} page creator.`),
    };
    const hashChangeHandler = (staticPart, dynamicPart) => {
      assert.step(`Should trigger hash-changed handler. Hash: ${staticPart}.`);
      assert.deepEqual(dynamicPart, {}, 'Should properly parse dynamic part of the url.');
    };
    const router = new Router(windowMock, fixture, pageMapping, defaultUrlHash, null, [hashChangeHandler]);
    router.redirectTo(defaultUrlHash);

    assert.verifySteps([
      `Should get hash from window: #${defaultUrlHash}.`,
      `Should call ${defaultUrlHash} page creator.`,
      `Should trigger hash-changed handler. Hash: ${defaultUrlHash}.`,
      `Should set hash to Window: #${defaultUrlHash}.`,
      `Should get hash from window: #${defaultUrlHash}.`,
      `Should call ${defaultUrlHash} page creator.`,
      `Should trigger hash-changed handler. Hash: ${defaultUrlHash}.`,
    ], 'Should redirect to another registered url.');
  });

  test('should redirect to not-existing url.', (assert) => {
    assert.expect(10);

    const defaultUrlHash = '/login';
    const notExistingUrlHash = '/not-existing-url-hash';
    const windowMock = new WindowMock(assert, defaultUrlHash);
    const pageMapping = {
      [defaultUrlHash]: () => assert.step(`Should call ${defaultUrlHash} page creator.`),
    };
    const notFoundPageCreator = () => assert.step(`Should call ${notExistingUrlHash} page creator.`);
    const hashChangeHandler = (staticPart, dynamicPart) => {
      assert.step(`Should trigger hash-changed handler. Hash: ${staticPart}.`);
      assert.deepEqual(dynamicPart, {}, 'Should properly parse dynamic part of the url.');
    };
    const router = new Router(windowMock, fixture, pageMapping, defaultUrlHash, notFoundPageCreator, [hashChangeHandler]);
    router.redirectTo(notExistingUrlHash);

    assert.verifySteps([
      `Should get hash from window: #${defaultUrlHash}.`,
      `Should call ${defaultUrlHash} page creator.`,
      `Should trigger hash-changed handler. Hash: ${defaultUrlHash}.`,
      `Should set hash to Window: #${notExistingUrlHash}.`,
      `Should get hash from window: #${notExistingUrlHash}.`,
      `Should call ${notExistingUrlHash} page creator.`,
      `Should trigger hash-changed handler. Hash: ${notExistingUrlHash}.`,
    ], 'Should redirect to another registered url.');
  });

  test('should render not-found-page.', (assert) => {
    assert.expect(4);

    const rootElement = {
      set innerHTML(content) {
        assert.step(`Should clear inner html of root element. Content: ${content}.`);
      },
    };
    const loginHash = '/login';
    const windowMock = new WindowMock();
    const pageCreatorsMap = {
      [loginHash]: () => {
      },
    };
    const notFoundPageCreator = () => {
      assert.step('Should call not-found-page creator.');
    };
    const router = new Router(windowMock, rootElement, pageCreatorsMap, loginHash, notFoundPageCreator, []);
    router.renderNotFoundPage();

    assert.verifySteps([
      'Should clear inner html of root element. Content: .',
      'Should clear inner html of root element. Content: .',
      'Should call not-found-page creator.',
    ], 'Should properly execute renderNotFoundPage().');
  });
});

/**
 * Mock for window object.
 */
class WindowMock extends EventTarget {

  /**
   * Instantiates WindowMock.
   *
   * @param {Qunit.assert} assert - Qunit assertions object.
   * @param {string} defaultHash - default url hash.
   */
  constructor(assert = null, defaultHash = '') {
    super();

    const selfWindow = this;

    this.location = {
      _hash: defaultHash ? `#${defaultHash}` : '',

      set hash(hash) {

        if (assert) {
          assert.step(`Should set hash to Window: ${hash}.`);
        }

        this._hash = `${hash}`;
        const event = new Event('hashchange');
        selfWindow.dispatchEvent(event);
      },

      get hash() {

        if (assert) {
          assert.step(`Should get hash from window: ${this._hash}.`);
        }

        return this._hash;
      },
    };
  }
}
