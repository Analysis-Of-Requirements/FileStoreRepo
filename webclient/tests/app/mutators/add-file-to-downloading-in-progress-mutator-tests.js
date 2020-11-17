import AddFileToDownloadingInProgressMutator
  from '../../../app/mutators/add-file-to-downloading-in-progress-mutator.js';

const {module, test} = QUnit;

export default module('Add File To Downloading In Progress Mutator', () => {

  test('should set downloading in progress value to state.', (assert) => {
    assert.expect(1);

    const state = {
      downloadingFiles: [],
    };
    const file = {
      id: 'mock-id',
    };
    const mutator = new AddFileToDownloadingInProgressMutator(file);
    mutator.apply(state);

    assert.deepEqual(state.downloadingFiles, [file], 'Should be equal to applied value.');
  });
});
