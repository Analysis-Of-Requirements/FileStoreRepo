import LoginForm from "../../../../../app/components/form/login/login-form.js";

const {module, test} = QUnit;

export default module('Login Form', () => {
    let fixture = document.getElementById('qunit-fixture');

    test('should render on page.', (assert) => {
        assert.expect(1);
        new LoginForm(fixture, {
            headerText: '',
        });
        const testData = fixture.querySelector('[data-test=login-form-rendered]');
        assert.ok(testData, 'Should render test data of login form.');
    });
});
