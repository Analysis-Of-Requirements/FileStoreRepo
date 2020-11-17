import State from '../../../app/state/state.js';
import RootFolderLoadingErrorMutator from '../../../app/mutators/root-folder-loading-error-mutator.js';

const {module, test} = QUnit;

export default module('Root Folder Loading Error Mutator', () => {

  test('should set error message to a state.', (assert) => {
    assert.expect(1);
    const error = new Error('new error message');
    const mutator = new RootFolderLoadingErrorMutator(error);
    const state = new State();
    mutator.apply(state);
    assert.deepEqual(state.rootFolderLoadingError, error, 'Should apply error to state.');
  });
});
