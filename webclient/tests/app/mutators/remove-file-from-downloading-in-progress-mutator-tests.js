import RemoveFileFromDownloadingInProgressMutator
  from '../../../app/mutators/remove-file-from-downloading-in-progress-mutator.js';

const {module, test} = QUnit;

export default module('Remove File From Downloading In Progress Mutator', () => {

  test('should remove list item from downloading items', (assert) => {
    assert.expect(3);

    const file = {
      id: 'mock-id',
    };
    const state = {
      set downloadingFiles(files) {
        assert.step(`Should set files: ${files.length}.`);
      },
      get downloadingFiles() {
        assert.step('Should retrieve files.');
        return [file];
      },
    };
    const mutator = new RemoveFileFromDownloadingInProgressMutator(file);
    mutator.apply(state);

    assert.verifySteps([
      'Should retrieve files.',
      `Should set files: 0.`,
    ], 'Should proper;y mutate state.');
  });
});
