import RouteChangedAction from '../../../app/actions/route-changed-action.js';
import LocationMutator from '../../../app/mutators/location-mutator.js';
import LocationParametersMutator from '../../../app/mutators/location-parameters-mutator.js';

const {module, test} = QUnit;

export default module('Route Changed Action', () => {

  test('should handle new static part.', async (assert) => {
    assert.expect(4);

    const staticPart = '/static';
    const dynamicPart = {
      dynamic: '/dynamic',
    };
    const action = new RouteChangedAction(staticPart, dynamicPart);

    const stateManager = {
      state: {
        get location() {
          assert.step('Should get location.');
        },
      },
      mutate(mutator) {
        assert.step(`Should call: ${mutator.constructor.name}.`);
      },
    };
    await action.apply(stateManager);

    assert.verifySteps([
      'Should get location.',
      `Should call: ${LocationMutator.name}.`,
      `Should call: ${LocationParametersMutator.name}.`,
    ], 'Should change both location and location parameters.');
  });

  test('should handle the same static part and non-empty dynamic part.', async (assert) => {
    assert.expect(3);

    const staticPart = '/static';
    const dynamicPart = {
      dynamic: '/dynamic',
    };
    const action = new RouteChangedAction(staticPart, dynamicPart);

    const stateManager = {
      state: {
        get location() {
          assert.step('Should get location.');
          return staticPart;
        },
      },
      mutate(mutator) {
        assert.step(`Should call: ${mutator.constructor.name}.`);
      },
    };
    await action.apply(stateManager);

    assert.verifySteps([
      'Should get location.',
      `Should call: ${LocationParametersMutator.name}.`,
    ], 'Should change only location parameters.');
  });

  test('should handle the same static part and empty dynamic part.', async (assert) => {
    assert.expect(2);

    const staticPart = '/static';
    const dynamicPart = {};
    const action = new RouteChangedAction(staticPart, dynamicPart);

    const stateManager = {
      state: {
        get location() {
          assert.step('Should get location.');
          return staticPart;
        },
      },
      mutate(mutator) {
        assert.step(`Should call: ${mutator.constructor.name}.`);
      },
    };
    await action.apply(stateManager);

    assert.verifySteps([
      'Should get location.',
    ], 'Should not call any mutator.');
  });
});
