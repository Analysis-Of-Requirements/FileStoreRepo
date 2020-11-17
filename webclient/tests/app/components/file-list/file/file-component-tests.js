import FileModel from '../../../../../app/models/file-model.js';
import FileType from '../../../../../app/components/file-list/file/file-type.js';
import FileComponent from '../../../../../app/components/file-list/file/file-component.js';

const {module, test} = QUnit;

export default module('File Component', (hooks) => {
  let fixture;

  hooks.beforeEach(() => {
    fixture = document.getElementById('qunit-fixture');
  });

  test('should render on page.', (assert) => {
    assert.expect(9);

    const fileMock = new FileModelMock();

    new FileComponent(fixture, {listItem: fileMock});
    const fileComponentTestData = fixture.querySelector('[data-test="file-component"]');
    assert.ok(fileComponentTestData, 'Should render file component test data.');

    const fileTypeElement = fixture.querySelector('[data-test="file-component-type"]');
    assert.ok(fileTypeElement, 'Should render file\'s type.');

    const fileIconElement = fixture.querySelector('[data-test="file-component-icon"]');
    assert.ok(fileIconElement, 'Should render file\'s icon.');

    const hasIconClass = fileIconElement.classList.contains('glyphicon-film');
    assert.ok(hasIconClass, 'Should have relevant class.');

    const fileNameElementContainer = fixture.querySelector('[data-test="file-component-name"]');
    assert.ok(fileNameElementContainer, 'Should render file\'s name element.');

    const fileNameElement = fileNameElementContainer.querySelector('[data-type="file-component-name"]');
    assert.strictEqual(fileNameElement.getAttribute('data-name'), 'mockName',
      'Should render file\'s name.');

    const fileSizeElement = fixture.querySelector('[data-test="file-component-size"]');
    assert.ok(fileSizeElement, 'Should render file\'s size.');

    assert.strictEqual(fileSizeElement.textContent.trim(), '10 B', 'Should render file\'s size.');

    const fileActionsElement = fixture.querySelector('[data-test="file-component-buttons"]');
    assert.ok(fileActionsElement, 'Should render file\'s action bar.');
  });

  test('should render relevant unit of size.', (assert) => {
    assert.expect(13);

    const sizeUnitMap = {
      '0': '0 B',
      '1': '1 B',
      '10': '10 B',
      '1023': '1020 B',
      '1024': '1 KB',
      '1025': '1 KB',
      '104857600': '100 MB',
      '1048576': '1 MB',
      '1048586': '1 MB',
      '2159686': '2.06 MB',
      '50331648': '48 MB',
      '2533274790395904': '2.25 PB',
      '1717213628': '1.6 GB',
    };

    Object.entries(sizeUnitMap)
      .forEach((entry) => {
        const bytes = Number.parseInt(entry[0]);
        const expected = entry[1];
        fixture.innerHTML = '';
        new FileComponent(fixture, {
          listItem: new FileModelMock({
            size: bytes,
          }),
        });
        const sizeContainer = fixture.querySelector('[data-test="file-component-size"]');
        const actual = sizeContainer.textContent.trim();
        assert.strictEqual(actual, expected, `Should properly render ${bytes} bytes: ${actual}.`);
      });
  });

  test('should render correct icon.', (assert) => {
    assert.expect(3);

    const {MUSIC, UNDEFINED} = FileType;
    const fileTypeIconMap = {
      'not-existing': 'glyphicon-file',
      [MUSIC]: 'glyphicon-music',
      [UNDEFINED]: 'glyphicon-file',
    };

    Object.entries(fileTypeIconMap)
      .forEach(([fileType, iconClass]) => {
        fixture.innerHTML = '';
        new FileComponent(fixture, {
          listItem: new FileModelMock({
            fileType,
          }),
        });
        const iconElement = fixture.querySelector('[data-test="file-component-icon"]');
        assert.ok(iconElement.classList.contains(iconClass), `Should contain correct icon class: ${iconClass}.`);
      });
  });

  test('should handle delete button click.', (assert) => {
    assert.expect(1);

    const item = new FileComponent(fixture, {
      listItem: {
        name: 'mock-name',
        size: 3,
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

    const item = new FileComponent(fixture, {
      listItem: {
        name: 'mock-name',
        size: 3,
      },
    });

    item.isDeletionInProgress = true;
    const rootElement = fixture.querySelector('[data-test="file-component"]');
    assert.ok(rootElement.classList.contains('deletion-in-progress'), 'Should container corresponding class.');
  });

  test('should handle download button click.', (assert) => {
    assert.expect(1);

    const file = {
      size: 3,
      name: 'mock-name',
      fileType: 'audio',
    };

    const item = new FileComponent(fixture, {
      listItem: file,
    });

    item.onDownloadButtonClick((fileModel) => {
      assert.ok(`Should handle upload button click. File.name: ${fileModel.name}.`);
    });

    fixture.querySelector('[data-type="list-item-download-button"]').click();
  });

  test('should handle downloading state in progress state', (assert) => {
    assert.expect(1);

    const item = new FileComponent(fixture, {
      listItem: {
        size: 3,
        name: 'mock-name',
        fileType: 'audio',
      },
    });

    item.isDownloadingInProgress = true;
    const rootElement = fixture.querySelector('[data-test="file-component"]');
    assert.ok(rootElement.classList.contains('downloading'), 'Should contain corresponding class.');
  });
});

/**
 * File Model Mock for testing purposes.
 */
class FileModelMock extends FileModel {

  /**
   * Instantiates FileModelMock.
   *
   * @param {number} size - file size in bytes.
   * @param {string} fileType - type of file.
   */
  constructor({size = 10, fileType = FileType.VIDEO} = {}) {
    super({
      name: 'mockName',
      type: 'file',
      fileType,
      size,
    });
  }
}
