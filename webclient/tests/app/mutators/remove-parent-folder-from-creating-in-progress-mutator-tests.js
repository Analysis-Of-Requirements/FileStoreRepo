import RemoveParentFolderFromCreatingInProgressMutator
  from '../../../app/mutators/remove-parent-folder-from-creating-in-progress-mutator.js';

const {module, test} = QUnit;

export default module('Remove Parent Folder From Creating In Progress Mutator', () => {

  test('should remove list item from renaming items', (assert) => {
    assert.expect(3);

    const folder = {
      id: 'mock-id',
      type: 'folder',
    };
    const state = {
      set parentFoldersCreatingInProgress(folders) {
        assert.step(`Should set folders. Length: ${folders.length}.`);
      },
      get parentFoldersCreatingInProgress() {
        assert.step('Should retrieve folders.');
        return [folder];
      },
    };
    const mutator = new RemoveParentFolderFromCreatingInProgressMutator(folder);
    mutator.apply(state);

    assert.verifySteps([
      'Should retrieve folders.',
      'Should set folders. Length: 0.',
    ], 'Should proper;y mutate state.');
  });
});
