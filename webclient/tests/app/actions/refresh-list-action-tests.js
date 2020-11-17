import RefreshListAction from '../../../app/actions/refresh-list-action.js';
import GetFolderContentAction from '../../../app/actions/get-folder-content-action.js';

const {module, test} = QUnit;

export default module('Refresh List Action', () => {

  test('should properly delegate refreshing folder content.', async (assert) => {
    assert.expect(3);

    const folderId = 'mock-folder-id';
    const stateManager = {
      async dispatchAction(action) {
        assert.step(`Should dispatch action: ${action.constructor.name}.`);

        if (action instanceof GetFolderContentAction) {
          assert.step(`GetFolderContentAction.folderId: ${action._folderId}.`);
        }
      },
      _state: {
        locationParams: {
          folderId,
        },
      },
    };

    const action = new RefreshListAction();
    await action.apply(stateManager);

    assert.verifySteps([
      `Should dispatch action: GetFolderContentAction.`,
      `GetFolderContentAction.folderId: ${folderId}.`,
    ], 'Should properly delegate refreshing folder content to get folder content action.');
  });
});
