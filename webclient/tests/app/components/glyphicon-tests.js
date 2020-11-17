import Glyphicon from '../../../app/components/glyphicon.js';

const {module, test} = QUnit;

export default module('Glyphicon', () => {
  let fixture = document.getElementById('qunit-fixture');

  test('should render on page.', (assert) => {
    assert.expect(3);

    const glyphiconClass = 'glyphicon-user';
    const glyphicon = new Glyphicon(fixture, {
      glyphIconClass: glyphiconClass,
    });
    const testData = fixture.querySelector('[data-test=glyphicon]');
    assert.ok(testData, 'Should render component test data.');

    const {classList} = glyphicon.rootElement;
    assert.ok(classList.contains('glyphicon'), 'Should have default glyphicon class.');
    assert.ok(classList.contains(glyphiconClass), 'Should set provided glyphicon class name.');
  });
});
