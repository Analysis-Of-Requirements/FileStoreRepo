import FileUploadingIssueMutator from '../../../app/mutators/file-uploading-issue-mutator.js';

const {module, test} = QUnit;

export default module('File Uploading Issue Mutator', () => {

  test('should set error to a state.', (assert) => {
    assert.expect(1);
    const error = new Error('new error message');
    const folder = {
      id: 'mock-name',
    };
    const fileName = 'mock-file-name';
    const mutator = new FileUploadingIssueMutator(error, fileName, folder);
    const state = {};
    mutator.apply(state);
    assert.deepEqual(state.uploadingFileIssue, {
      error,
      notUploadedFileName: fileName,
      parentFolder: folder,
    }, 'Should apply error issue to state.');
  });
});
