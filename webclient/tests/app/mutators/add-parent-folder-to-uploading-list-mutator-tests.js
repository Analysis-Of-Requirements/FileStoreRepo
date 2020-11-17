import AddParentFolderToUploadingListMutator from '../../../app/mutators/add-parent-folder-to-uploading-list-mutator.js';

const {module, test} = QUnit;

export default module('Add Parent Folder To Uploading List Mutator', () => {

  test('should set creating in progress value to state.', (assert) => {
    assert.expect(1);

    const state = {
      parentFoldersOfUploadingFiles: [],
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
    const mutator = new AddParentFolderToUploadingListMutator(folder);
    mutator.apply(state);

    assert.deepEqual(state.parentFoldersOfUploadingFiles, [folder],
      'Should be equal to applied parentFoldersOfUploadingFiles value.');
  });
});
