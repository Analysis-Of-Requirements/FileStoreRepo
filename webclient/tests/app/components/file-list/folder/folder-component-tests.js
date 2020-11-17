import FolderModel from '../../../../../app/models/folder-model.js';
import FolderComponent from '../../../../../app/components/file-list/folder/folder-component.js';

const {module, test} = QUnit;

export default module('Folder Component', (hooks) => {
  let fixture;

  hooks.beforeEach(() => {
    fixture = document.getElementById('qunit-fixture');
  });

  test('should render on page.', (assert) => {
    assert.expect(9);

    const folderMock = new FolderModelMock();

    new FolderComponent(fixture, {listItem: folderMock});
    const folderComponentTestData = fixture.querySelector('[data-test="folder-component"]');
    assert.ok(folderComponentTestData, 'Should render folder component test data.');

    const folderTypeElement = fixture.querySelector('[data-test="folder-component-type"]');
    assert.ok(folderTypeElement, 'Should render folder\'s type.');

    const folderIconElement = fixture
      .querySelector('[data-type="folder-icon-container"] [data-test="glyphicon"]');
    assert.ok(folderIconElement, 'Should render folder\'s icon.');

    const hasIconClass = folderIconElement.classList.contains('glyphicon-folder-close');
    assert.ok(hasIconClass, 'Should have relevant class.');

    const folderNameElementContainer = fixture.querySelector('[data-test="folder-component-name"]');
    assert.ok(folderNameElementContainer, 'Should render folder\'s name element.');

    const folderNameElement = folderNameElementContainer.querySelector('[data-type="folder-component-name"]');
    assert.strictEqual(folderNameElement.getAttribute('data-name'), 'mockName',
      'Should render folder\'s name.');

    const folderSizeElement = fixture.querySelector('[data-test="folder-component-size"]');
    assert.ok(folderSizeElement, 'Should render folder\'s size.');

    assert.strictEqual(folderSizeElement.textContent.trim(), '3 items', 'Should render folder\'s size.');

    const folderActionsElement = fixture.querySelector('[data-test="folder-component-buttons"]');
    assert.ok(folderActionsElement, 'Should render folder\'s action bar.');
  });

  test('should handle delete button click.', (assert) => {
    assert.expect(1);

    const item = new FolderComponent(fixture, {
      listItem: {
        name: 'mock-name',
        itemsAmount: 3,
      },
    });

    item.onDeleteButtonClick(() => {
      assert.ok('Should handle delete button click');
    });

    fixture.querySelector('[data-type="list-item-remove-button"]')
      .click();
  });

  test('should handle deletion in progress state', (assert) => {
    assert.expect(1);

    const item = new FolderComponent(fixture, {
      listItem: {
        name: 'mock-name',
        itemsAmount: 3,
      },
    });

    item.isDeletionInProgress = true;
    const rootElement = fixture.querySelector('[data-test="folder-component"]');
    assert.ok(rootElement.classList.contains('deletion-in-progress'), 'Should container corresponding class.');
  });

  test('should handle upload button click.', (assert) => {
    assert.expect(1);

    const item = new FolderComponent(fixture, {
      listItem: {
        name: 'mock-name',
        itemsAmount: 3,
      },
    });

    item.onUploadButtonClick(() => {
      assert.ok('Should handle upload button click.');
    });

    fixture.querySelector('[data-type="list-item-upload-button"]').click();
  });

  test('should handle uploading file in progress state', (assert) => {
    assert.expect(1);

    const item = new FolderComponent(fixture, {
      listItem: {
        name: 'mock-name',
        itemsAmount: 3,
      },
    });

    item.isUploadingFileInProgress = true;
    const rootElement = fixture.querySelector('[data-test="folder-component"]');
    assert.ok(rootElement.classList.contains('uploading-folder'), 'Should container corresponding class.');
  });
});

/**
 * Folder Model Mock for testing purposes.
 */
class FolderModelMock extends FolderModel {

  /**
   * Instantiates FolderModelMock.
   */
  constructor() {
    super({
      name: 'mockName',
      type: 'folder',
      itemsAmount: 3,
    });
  }
}
