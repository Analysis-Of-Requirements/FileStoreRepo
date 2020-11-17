import RemoveParentFolderFromUploadingListMutator
  from '../../../app/mutators/remove-parent-folder-from-uploading-list-mutator.js';

const {module, test} = QUnit;

export default module('Remove Parent Folder From Uploading In Progress Mutator', () => {

  test('should remove folder from uploading list.', (assert) => {
    assert.expect(3);

    const folder = {
      id: 'mock-id',
      type: 'folder',
    };
    const state = {
      set parentFoldersOfUploadingFiles(folders) {
        assert.step(`Should set folders. Length: ${folders.length}.`);
      },
      get parentFoldersOfUploadingFiles() {
        assert.step('Should retrieve folders.');
        return [folder];
      },
    };
    const mutator = new RemoveParentFolderFromUploadingListMutator(folder);
    mutator.apply(state);

    assert.verifySteps([
      'Should retrieve folders.',
      'Should set folders. Length: 0.',
    ], 'Should properly mutate state.');
  });
});
