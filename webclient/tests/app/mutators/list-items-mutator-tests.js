import ListItemsMutator from '../../../app/mutators/list-items-mutator.js';
import State from '../../../app/state/state.js';
import FolderModel from '../../../app/models/folder-model.js';
import FileModel from '../../../app/models/file-model.js';

const {module, test} = QUnit;

export default module('List Items Mutator', () => {

  test('should set list of items to a state.', (assert) => {
    assert.expect(1);

    const state = new State();
    const factory = new MockListItemObjectFactory();
    const fileObject = factory.create('file');
    const mutator = new ListItemsMutator([fileObject]);
    mutator.apply(state);

    const fileModel = new FileModel(fileObject);
    assert.deepEqual(state.listItems, [fileModel], 'Should be equal to applied list of items.');
  });

  test('should create instance of list item model.', (assert) => {
    assert.expect(2);

    [['folder', FolderModel], ['file', FileModel]].forEach(([type, constructor]) => {
      const objectFactory = new MockListItemObjectFactory();
      const mockItem = objectFactory.create(type);
      const state = new State();
      const mutator = new ListItemsMutator([mockItem]);
      mutator.apply(state);
      const model = state.listItems[0];

      assert.ok(model instanceof constructor, `Should create ${constructor} instance for ${type} type.`);
    });
  });

  test('should not create model for incorrect type.', (assert) => {
    assert.expect(2);

    ['wrongType', null].forEach((type) => {
      const state = new State();
      const mutator = new ListItemsMutator([{
        type,
      }]);

      assert.throws(
        () => mutator.apply(state),
        new TypeError(`Cannot create model for type ${type}.`),
        'Should throw TypeError if items contains wrong type or null',
      );
    });
  });
});

/**
 * Factory for creating mock list-item-model object.
 */
class MockListItemObjectFactory {

  /**
   * Creates mock item with provided type.
   *
   * @param {*} type - list item type.
   * @return {{size: number, name: string, itemsAmount: number, id: string, type: *, fileType: string, parentId: string}}
   * created mock item.
   */
  create(type) {
    return {
      name: 'mock-object',
      id: 'mock-id',
      type,
      fileType: 'mockFileType',
      size: 13,
      itemsAmount: 13,
      parentId: 'mock-parent-id',
    };
  }
}

