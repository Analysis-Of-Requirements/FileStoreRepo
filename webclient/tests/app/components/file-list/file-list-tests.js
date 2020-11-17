import FileList from '../../../../app/components/file-list/file-list.js';
import FileModel from '../../../../app/models/file-model.js';
import FileType from '../../../../app/components/file-list/file/file-type.js';
import FolderModel from '../../../../app/models/folder-model.js';

const {module, test} = QUnit;

export default module('File List', (hooks) => {
  let fixture;

  const listItemTypes = {
    FOLDER: 'folder',
    FILE: 'file',
  };

  hooks.beforeEach(() => {
    fixture = document.getElementById('qunit-fixture')
  });

  test('should render on page.', (assert) => {
    assert.expect(1);
    new FileList(fixture);
    assert.ok(fixture.querySelector('[data-test="file-list"]'), 'Should render component test data.');
  });

  test('should render list items in correct order.', (assert) => {
    assert.expect(6);

    const list = new FileList(fixture);
    const itemFactory = new MockItemFactory();
    const {FILE, FOLDER} = listItemTypes;
    const listItems = [
      itemFactory.create(FILE, 'C'),
      itemFactory.create(FILE, 'B'),
      itemFactory.create(FOLDER, 'D'),
      itemFactory.create(FILE, 'B'),
      itemFactory.create(FOLDER, 'A'),
    ];
    list.listItems = listItems;

    const folderElements = fixture.querySelectorAll('[data-test="folder-component"]');
    const fileElements = fixture.querySelectorAll('[data-test="file-component"]');
    assert.strictEqual(folderElements.length + fileElements.length, 5, 'Should render all list items.');

    const listElements = fixture.querySelectorAll('[data-type="list-item-component"]');

    assert.ok(listElements.item(0)
        .querySelector(`[data-type="folder-component-name"][data-name="A"]`),
      'Should render first folder in correct position.');

    assert.ok(listElements.item(1)
        .querySelector(`[data-type="folder-component-name"][data-name="D"]`),
      'Should render second folder in correct position.');

    assert.ok(listElements.item(2)
        .querySelector(`[data-type="file-component-name"][data-name="B"]`),
      'Should render first file in correct position.');

    assert.ok(listElements.item(3)
        .querySelector(`[data-type="file-component-name"][data-name="B"]`),
      'Should render second file in correct position.');

    assert.ok(listElements.item(4)
        .querySelector(`[data-type="file-component-name"][data-name="C"]`),
      'Should render third file in correct position.');
  });

  test('should clear list when new list is about to render.', (assert) => {
    assert.expect(3);

    const list = new FileList(fixture);
    const itemFactory = new MockItemFactory();
    const {FILE, FOLDER} = listItemTypes;

    const initialListItems = [
      itemFactory.create(FOLDER, 'A'),
    ];
    list.listItems = initialListItems;
    let initialListElements = fixture.querySelectorAll('[data-type="folder-component-name"][data-name="A"]');
    assert.strictEqual(initialListElements.length, 1, 'Should render initial list of elements.');

    const newListItems = [
      itemFactory.create(FILE, 'B'),
    ];
    list.listItems = newListItems;
    initialListElements = fixture.querySelectorAll('[data-type="folder-component-name"][data-name="A"]');
    const newListElements = fixture.querySelectorAll('[data-type="file-component-name"][data-name="B"]');
    assert.strictEqual(initialListElements.length, 0, 'Should clear initial list of elements.');
    assert.strictEqual(newListElements.length, 1, 'Should render new list of elements.');
  });

  test('should execute handler on \'download-file\' event raised.', (assert) => {
    assert.expect(2);
    const done = assert.async();

    const {MUSIC} = FileType;
    const listItem = new FileModel({
      id: 'file-id',
      name: 'file-name',
      type: 'file',
      fileType: MUSIC,
      size: 10,
      parentId: 'parent-id',
    });
    const component = new FileList(fixture);
    component.listItems = [listItem];
    component.onDownloadFileStart((fileModel) => {
      assert.step(`Should execute handler with passed file: ${fileModel.id}.`);
      done();
    });
    const downloadElement = fixture
      .querySelector('[data-test="file-list"] [data-type="list-item-component"] [data-type="list-item-download-button"]');
    downloadElement.click();

    assert.verifySteps([
      `Should execute handler with passed file: ${listItem.id}.`,
    ], 'Should properly execute \'download-button\' click.');
  });
});

/**
 * Factory for creating mock list items.
 */
class MockItemFactory {

  /**
   * Creates mock list item.
   *
   * @param {string} type - type of list item.
   * @param {string} id - id of list item.
   * @return {FileModel|FolderModel} - created item.
   */
  create(type, id) {

    if (type === 'folder') {
      return new FolderModel({
        name: id,
        id,
        type,
        itemsAmount: 10,
        parentId: id,
      });
    }

    return new FileModel({
      name: id,
      id,
      type,
      fileType: FileType.VIDEO,
      size: 10,
      parentId: id,
    });
  }
}
