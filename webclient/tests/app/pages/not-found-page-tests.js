import NotFoundPage from '../../../app/pages/not-found-page.js';

const {module, test} = QUnit;

export default module('Not Found Page', (hooks) => {
  let fixture;

  hooks.beforeEach(() => {
    fixture = document.getElementById('qunit-fixture');
  });

  test('should render page content.', (assert) => {
    assert.expect(3);

    const titleServiceMock = {
      setPage(pageTitle) {
      },
    };

    new NotFoundPage(fixture, {
      linkToFollow: 'Link',
      resourceName: 'Resource',
      titleService: titleServiceMock,
    });

    const container = fixture.querySelector('[data-test=page-not-found]');
    assert.ok(container, 'Should load page container.');

    const text = container.querySelector('[data-test="page-not-found-message"]')
      .innerText
      .trim();
    assert.strictEqual(text, 'Resource was not found. Try this way.', 'Should load page message.');

    const link = container.querySelector('[data-test="page-not-found-link"]')
      .getAttribute('href');
    assert.strictEqual(link, '#Link', 'Should load link to follow.');
  });

  test('should change tab title.', (assert) => {
    assert.expect(2);

    const titleService = {
      setPage(pageTitle) {
        assert.step(`Page title is set: ${pageTitle}.`);
      },
    };

    new NotFoundPage(fixture, {
      resourceName: 'Resource',
      titleService,
    });

    assert.verifySteps(['Page title is set: Resource Not Found.'], 'Should properly set page title.');
  });
});
