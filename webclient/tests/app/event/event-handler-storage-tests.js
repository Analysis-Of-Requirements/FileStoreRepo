import EventHandlersStorage from '../../../app/event/event-handlers-storage.js';

const {module, test} = QUnit;

export default module('Event Handler Storage', () => {

  test('should properly execute handlers.', (assert) => {
    assert.expect(2);

    const storage = new EventHandlersStorage();
    const handler = (params) => {
      assert.step(`Should execute handler with passed params: ${params}.`);
    };
    storage.addEventHandler(handler);
    const param = '111';
    storage.executeHandlers(param);

    assert.verifySteps([
      `Should execute handler with passed params: ${param}.`,
    ], 'Should properly execute handler.');
  });

  test('should not register other types, except functions.', (assert) => {
    assert.expect(2);

    const storage = new EventHandlersStorage();

    const literal = '123';
    assert.throws(
      () => {
        storage.addEventHandler(literal);
      },
      'Should not accept literals as parameters.',
    );

    const object = {
      handler() {
      },
    };
    assert.throws(
      () => {
        storage.addEventHandler(object);
      },
      'Should not accept objects as parameters.',
    );
  });
});
