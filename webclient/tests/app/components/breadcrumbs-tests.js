import Breadcrumbs from '../../../app/components/breadcrumbs.js';

const {module, test} = QUnit;

export default module('Breadcrumbs', (hooks) => {
  let fixture;

  hooks.beforeEach(() => {
    fixture = document.getElementById('qunit-fixture');
  });

  test('should render on page.', (assert) => {
    assert.expect(2);

    new Breadcrumbs(fixture, {
      isLoading: true,
    });
    const rootElement = fixture.querySelector('[data-test=breadcrumbs]');
    assert.ok(rootElement, 'Should render component test data.');
    assert.ok(rootElement.querySelector('[data-type="folder-loader"]'), 'Should render initial loader.');
  });

  test('should render trail name.', (assert) => {
    assert.expect(2);

    const trailName = 'Shop';
    const parentId = 'parent-id';
    const breadcrumbs = new Breadcrumbs(fixture, {
      isLoading: false,
    });
    breadcrumbs.renderTrail(trailName, parentId);

    const iconContainer = fixture.querySelector('[data-type="breadcrumbs-icon-container"]');
    const link = iconContainer.querySelector('[data-type="breadcrumbs-parent-folder-id"]');
    assert.strictEqual(link.getAttribute('href'), `#/folder/${parentId}`, 'Should render parent id.');

    const textContainer = fixture.querySelector('[data-type="breadcrumbs-text"]');
    assert.strictEqual(textContainer.textContent.trim(), `/ ${trailName}`, 'Should render trail text.');
  });

  test('should render loader.', (assert) => {
    assert.expect(2);

    const breadcrumbs = new Breadcrumbs(fixture, {
      isLoading: false,
    });
    breadcrumbs.renderLoader();

    const loader = fixture.querySelector('[data-type="breadcrumbs-icon-container"] [data-type="folder-loader"]');
    assert.ok(loader, 'Should render loader.');

    const textContainer = fixture.querySelector('[data-type="breadcrumbs-text"]');
    assert.strictEqual(textContainer.textContent.trim(),  '/ ...', 'Should render loader text');
  });

  test('should render error.', (assert) => {
    assert.expect(3);

    const errorMessage = 'error-message';
    const breadcrumbs = new Breadcrumbs(fixture, {
      isLoading: false,
    });
    breadcrumbs.renderErrorMessage(errorMessage);

    const icon = fixture.querySelector('[data-type="breadcrumbs-icon-container"]').firstElementChild;
    assert.ok(icon.classList.contains('glyphicon-folder-open'), 'Should render correct icon.');

    const textContainer = fixture.querySelector('[data-type="breadcrumbs-text"]');
    assert.strictEqual(textContainer.textContent.trim(), `/ ${errorMessage}`, 'Should render error text.');
    assert.ok(textContainer.classList.contains('error-text'), 'Shouly mark textContainer with error class.');
  });
});
