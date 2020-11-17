import AddParentFolderToCreatingInProgressMutator
  from '../../../app/mutators/add-parent-folder-to-creating-in-progress-mutator.js';

const {module, test} = QUnit;

export default module('Add Parent Folder To Creating In Progress Mutator', () => {

  test('should set creating in progress value to state.', (assert) => {
    assert.expect(1);

    const state = {
      parentFoldersCreatingInProgress: [],
    };
    const folder = {
      id: 'mock-id',
      type: 'folder',
      name: 'mock-name',
      size: null,
      fileType: null,
      itemsAmount: 3,
      parentId: 'parentFolderID',
    };
    const mutator = new AddParentFolderToCreatingInProgressMutator(folder);
    mutator.apply(state);

    assert.deepEqual(state.parentFoldersCreatingInProgress, [folder],
      'Should be equal to applied isFolderCreatingInProgress value.');
  });
});
