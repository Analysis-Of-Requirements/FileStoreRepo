import FolderModel from '../../../app/models/folder-model.js';
import State from '../../../app/state/state.js';
import RootFolderMutator from '../../../app/mutators/root-folder-mutator.js';

const {module, test} = QUnit;

export default module('Root Folder Mutator', () => {

  test('should change folder property of the state', async (assert) => {
    assert.expect(1);

    const folder = {
      name: 'mock-folder',
      id: 'mock-folder-id',
      type: 'folder',
      fileType: null,
      size: null,
      itemsAmount: 3,
      parentId: 'mock-folder-parent-id',
    };
    const mutator = new RootFolderMutator(folder);

    const state = new State();
    mutator.apply(state);

    assert.deepEqual(state.rootFolder, new FolderModel(folder), 'Should change root folder property of the state.');
  });
});
