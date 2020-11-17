import LocationParametersMutator from '../../../app/mutators/location-parameters-mutator.js';
import State from '../../../app/state/state.js';

const {module, test} = QUnit;

export default module('Location Parameters Mutator', () => {

  test('should change location parameters property of the state.', async (assert) => {
    assert.expect(1);

    const locationParams = {
      folderId: 'location-params-mock',
    };
    const mutator = new LocationParametersMutator(locationParams);

    const state = new State();
    state.locationParams = {
      notFolderId: 'wrong-location-mock',
    };
    mutator.apply(state);

    assert.deepEqual(state.locationParams, locationParams, 'Should change \'location-params\' property of the state.');
  });
});
