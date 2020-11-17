import LocationMutator from '../../../app/mutators/location-mutator.js';
import State from '../../../app/state/state.js';

const {module, test} = QUnit;

export default module('Location Mutator', () => {

  test('should change location property.', async (assert) => {
    assert.expect(1);

    const location = 'location-mock';
    const mutator = new LocationMutator(location);

    const state = new State();
    state.location = 'wrong-location-mock';
    mutator.apply(state);

    assert.strictEqual(state.location, location, 'Should change \'location\' property of the state.');
  });
});
