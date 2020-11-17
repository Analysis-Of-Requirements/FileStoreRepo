import StateManager from '../../../app/state/state-manager.js';
import State from '../../../app/state/state.js';
import Action from '../../../app/actions/action.js';
import Mutator from '../../../app/mutators/mutator.js';

const {module, test} = QUnit;

export default module('State Manager', () => {

  test('should dispatch action.', (assert) => {
    assert.expect(2);

    class MockAction extends Action {
      async apply(stateManager) {
        assert.step('action applied.');
      }
    }

    const state = new MockState();
    const action = new MockAction();
    const manager = new StateManager(state, {apiService: null});
    manager.dispatchAction(action);

    assert.verifySteps(['action applied.'], 'Should apply action.');
  });

  test('should apply mutator.', (assert) => {
    assert.expect(2);

    class MockMutator extends Mutator {
      apply(state) {
        assert.step('mutator applied.');
      }
    }

    const state = new MockState();
    const mutator = new MockMutator();
    const manager = new StateManager(state, {apiService: null});
    manager.mutate(mutator);

    assert.verifySteps(['mutator applied.'], 'Should apply mutator.');
  });

  test('should handle \'state-changed\'  event.', (assert) => {
    assert.expect(2);
    const done = assert.async();

    const value = '345';
    class MockMutator extends Mutator {
      apply(state) {
        state.mockField = value;
      }
    }

    const state = new MockState();
    const mutator = new MockMutator();
    const manager = new StateManager(state, {apiService: null});
    manager.onStateChanged('mockField', (event) => {
      assert.step(`Should trigger handler. State: ${event.detail.state.mockField}.`);
      done();
    });
    manager.mutate(mutator);

    assert.verifySteps([`Should trigger handler. State: ${value}.`],
      'Should trigger handler after state changed.');
  });
});

/**
 * Mock class for State.
 */
class MockState extends State {

  /**
   * @type {string}
   */
  mockField;
}
