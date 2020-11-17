import FolderCreatingErrorMutator from '../../../app/mutators/folder-creating-error-mutator.js';

const {module, test} = QUnit;

export default module('Folder Creating Error Mutator', () => {

  test('should set error to a state.', (assert) => {
    assert.expect(1);
    const error = new Error('new error message');
    const mutator = new FolderCreatingErrorMutator(error);
    const state = {};
    mutator.apply(state);
    assert.deepEqual(state.folderCreatingError, error, 'Should apply error to state.');
  });
});
