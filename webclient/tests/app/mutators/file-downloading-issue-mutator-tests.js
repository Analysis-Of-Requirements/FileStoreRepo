import FileDownloadingIssueMutator from '../../../app/mutators/file-downloading-issue-mutator.js';

const {module, test} = QUnit;

export default module('File Downloading Issue Mutator', () => {

  test('should set error to a state.', (assert) => {
    assert.expect(1);
    const error = new Error('new error message');
    const file = {
      id: 'mock-name',
    };
    const mutator = new FileDownloadingIssueMutator(error, file);
    const state = {};
    mutator.apply(state);
    assert.deepEqual(state.downloadingFileIssue, {
      error,
      file,
    }, 'Should apply error issue to state.');
  });
});
