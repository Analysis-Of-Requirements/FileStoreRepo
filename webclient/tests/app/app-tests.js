import Application from '../../app/app.js';

const {module, test} = QUnit;

export default module('Application', () => {

  test('should render on page.', (assert) => {
    assert.expect(1);

    const fixture = document.getElementById('qunit-fixture');
    new Application(fixture);
    const testData = fixture.querySelector('[data-test=app]');

    assert.ok(testData, 'Should render app markup on page.');
  });
});
