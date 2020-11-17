import Anchor from '../../../app/components/anchor.js';

const {module, test} = QUnit;

export default module('Anchor', () => {
  let fixture = document.getElementById('qunit-fixture');

  test("should render on page.", (assert) => {
    assert.expect(1);

    new Anchor(fixture, {
      anchorReference: '/login',
      target: '_self',
      textContent: 'anchor-text',
    });

    const testData = fixture.querySelector("[data-test=anchor]");
    assert.ok(testData, "Cannot render component test data.");
  });
});
