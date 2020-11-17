import State from '../../../app/state/state.js';
import FolderLoadingMutator from '../../../app/mutators/folder-loading-mutator.js';

const {module, test} = QUnit;

export default module('Folder Loading Mutator', () => {

  test('should set \'isLoading\' property value state.', (assert) => {
    assert.expect(1);

    const state = new State();
    const isLoading = true;
    const mutator = new FolderLoadingMutator(isLoading);
    mutator.apply(state);

    assert.strictEqual(state.isFolderLoading, isLoading, `Should be equal to applied isFolderLoading value.`);
  });
});
