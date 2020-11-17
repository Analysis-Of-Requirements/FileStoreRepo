import FolderLoadingErrorMutator from '../../../app/mutators/folder-loading-error-mutator.js';
import State from '../../../app/state/state.js';

const {module, test} = QUnit;

export default module('Folder Loading Error Mutator', () => {

  test('should set error message to a state.', (assert) => {
    assert.expect(1);
    const error = new Error('new error message');
    const mutator = new FolderLoadingErrorMutator(error);
    const state = new State();
    mutator.apply(state);
    assert.deepEqual(state.folderLoadingError, error, 'Should apply error to state.');
  });
});
