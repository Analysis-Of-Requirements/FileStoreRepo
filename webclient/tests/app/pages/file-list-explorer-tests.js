import FileListExplorer from '../../../app/pages/file-list-explorer.js';
import StateManager from '../../../app/state/state-manager.js';
import State from '../../../app/state/state.js';
import FileModel from '../../../app/models/file-model.js';
import FolderModel from '../../../app/models/folder-model.js';
import AuthenticationError from '../../../app/models/errors/authentication-error.js';
import Action from '../../../app/actions/action.js';
import ResourceNotFoundError from '../../../app/models/errors/resource-not-found-error.js';
import GeneralServerError from '../../../app/models/errors/general-server-error.js';

const {module, test} = QUnit;

export default module('File List Explorer', (hooks) => {
  let fixture;

  hooks.beforeEach(() => {
    fixture = document.getElementById('qunit-fixture');
  });

  test('should properly initialize.', (assert) => {
    assert.expect(7);

    const state = new State();
    const stateManager = new StateManager(state, {
      apiService: null,
    });
    const titleService = {
      setPage(page) {
        assert.step(`Should set page name: ${page}.`);
      },
    };
    new FileListExplorer(fixture, stateManager, {titleService});
    const listExplorerTestData = fixture.querySelector('[data-test=list-explorer]');
    assert.ok(listExplorerTestData, 'Should render list explorer.');

    const userDetailsTestData = fixture.querySelector('[data-type="user-details"]');
    assert.ok(userDetailsTestData, 'Should render user details.');

    const breadcrumbsTestData = fixture.querySelector('[data-test=breadcrumbs]');
    assert.ok(breadcrumbsTestData, 'Should render breadcrumbs.');

    const buttonsAmount = fixture.querySelectorAll('[data-test=button]').length;
    assert.ok(buttonsAmount === 2, 'Should render buttons.');

    assert.ok(fixture.querySelector('[data-test="file-list"]'), 'Should render list.');

    assert.verifySteps(['Should set page name: File List.'], 'Should properly initialize on page.');
  });

  test('should handle list-items-changed event.', (assert) => {
    assert.expect(4);

    const stateManager = new StateManagerMock(assert);
    const titleService = {
      setPage(page) {
      },
    };
    new FileListExplorer(fixture, stateManager, {titleService});
    const mockItems = [
      new FileModel({
        name: 'file1',
        type: 'file',
        size: 3,
      }),
      new FileModel({
        name: 'file2',
        type: 'file',
        size: 3,
      }),
      new FolderModel({
        name: 'folder1',
        type: 'folder',
      }),
    ];

    stateManager.setMockState({
      renamingListItems: [],
      listItemsToDelete: [],
    });
    stateManager.stateChangedMock('listItems', mockItems);

    const expectedFolders = 1;
    const folders = fixture.querySelectorAll('[data-test="folder-component"]');
    assert.strictEqual(folders.length, expectedFolders, 'Should render folder component.');

    const expectedFiles = 2;
    const files = fixture.querySelectorAll('[data-test="file-component"]');
    assert.strictEqual(files.length, expectedFiles, 'Should render 2 files components.');

    assert.verifySteps([
      `Should execute 'statechanged.listItems' event handler.`,
    ], 'Should properly handle \'lishould handle folde\' event.');
  });

  test('should handle list-item-loading 4** errors.', (assert) => {
    assert.expect(8);

    const stateManager = new StateManagerMock(assert);
    const titleService = {
      setPage(page) {
      },
    };

    const toastService = {
      showError(message) {
        assert.step(`Error message: ${message}.`);
      },
    };

    const listExplorer = new FileListExplorer(fixture, stateManager, {titleService, toastService});
    listExplorer.onAuthenticationError(() => {
      assert.step('Should trigger AuthenticationError handler.');
    });
    listExplorer.onResourceNotFoundError(() => {
      assert.step('Should trigger ResourceNotFoundError handler.');
    });

    const message = 'Something should go wrong.';
    [new AuthenticationError(message), new ResourceNotFoundError(message)].forEach((error) => {

      stateManager.stateChangedMock('listItemsLoadingError', error);

      assert.verifySteps([
        `Should execute 'statechanged.listItemsLoadingError' event handler.`,
        `Error message: ${message}.`,
        `Should trigger ${error.constructor.name} handler.`,
      ], `Should properly handle ${error.constructor.name} event.`);
    });
  });

  test('should handle list-item-loading server error.', (assert) => {
    assert.expect(3);

    const stateManager = new StateManagerMock(assert);
    const titleService = {
      setPage(page) {
      },
    };

    const toastService = {
      showError(message) {
        assert.step(`Error message: ${message}.`);
      },
    };

    new FileListExplorer(fixture, stateManager, {titleService, toastService});

    stateManager.stateChangedMock('listItemsLoadingError', new GeneralServerError());

    assert.verifySteps([
      'Should execute \'statechanged.listItemsLoadingError\' event handler.',
      'Error message: Cannot retrieve items list from server..',
    ], 'Should handle list-items-loading server error.');
  });

  test('should handle list-items-loading event.', (assert) => {
    assert.expect(5);

    const stateManager = new StateManagerMock(assert);
    const titleService = {
      setPage(page) {
      },
    };
    new FileListExplorer(fixture, stateManager, {titleService});
    const loader = fixture.querySelector('[data-type="folder-content-loader"]');
    const loaderClass = 'folder-content-loader';

    stateManager.stateChangedMock('isListItemsLoading', true);
    assert.step(`State.isListItemsLoading should be equal to ${loader.classList.contains(loaderClass)}.`);

    stateManager.stateChangedMock('isListItemsLoading', false);
    assert.step(`State.isListItemsLoading should be equal to ${loader.classList.contains(loaderClass)}.`);

    assert.verifySteps([
      'Should execute \'statechanged.isListItemsLoading\' event handler.',
      'State.isListItemsLoading should be equal to true.',
      'Should execute \'statechanged.isListItemsLoading\' event handler.',
      'State.isListItemsLoading should be equal to false.',
    ], 'Should properly handle \'list-items-loading\' event.');
  });

  test('should handle folder event.', (assert) => {
    assert.expect(3);

    const stateManager = new StateManagerMock(assert);
    stateManager.setMockState({
      parentFoldersCreatingInProgress: [],
      parentFoldersOfUploadingFiles: [],
    });
    const titleService = {
      setPage(page) {
      },
    };
    new FileListExplorer(fixture, stateManager, {titleService});

    const folder = {
      id: 'folder-id-mock',
      name: 'folder-name',
      type: 'folder',
      parentId: '123',
    };
    stateManager.stateChangedMock('folder', folder);

    const breadcrumbsText = fixture.querySelector('[data-type="breadcrumbs-text"]');
    assert.strictEqual(breadcrumbsText.textContent.trim(), `/ ${folder.name}`, 'Should properly set text to breadcrumbs.');

    assert.verifySteps([
      'Should execute \'statechanged.folder\' event handler.',
    ], 'Should properly handle \'folder\' event.');
  });

  test('should handle is-folder-loading event.', (assert) => {
    assert.expect(3);

    const stateManager = new StateManagerMock(assert);
    const titleService = {
      setPage(page) {
      },
    };
    new FileListExplorer(fixture, stateManager, {titleService});
    stateManager.stateChangedMock('isFolderLoading', true);

    const breadcrumbsLoader = fixture.querySelector('[data-type="folder-loader"]');
    assert.ok(breadcrumbsLoader, 'Should render loader.');

    assert.verifySteps([
      'Should execute \'statechanged.isFolderLoading\' event handler.',
    ], 'Should properly handle \'folder\' event.');
  });

  test('should handle \'folder-loading\' errors.', (assert) => {
    assert.expect(8);

    const stateManager = new StateManagerMock(assert);
    const titleService = {
      setPage(page) {
      },
    };
    const listExplorer = new FileListExplorer(fixture, stateManager, {titleService});
    listExplorer.onAuthenticationError(() => {
      assert.step('Should trigger AuthenticationError handler.');
    });
    listExplorer.onResourceNotFoundError(() => {
      assert.step('Should trigger ResourceNotFoundError handler.');
    });
    const message = 'Something should go wrong.';
    [new AuthenticationError(message), new ResourceNotFoundError(message)].forEach((error) => {
      stateManager.stateChangedMock('folderLoadingError', error);

      const breadcrumbsText = fixture.querySelector('[data-type="breadcrumbs-text"]');
      assert.strictEqual(breadcrumbsText.textContent.trim(), `/ ${message}`, 'Should properly set error text to breadcrumbs.');

      assert.verifySteps([
        `Should execute 'statechanged.folderLoadingError' event handler.`,
        `Should trigger ${error.constructor.name} handler.`,
      ], 'Should properly handle \'list-items-changed\' event.');
    });
  });

  test('should handle \'root-folder\' changed event.', (assert) => {
    assert.expect(3);

    const stateManager = new StateManagerMock(assert);
    const titleService = {
      setPage(page) {
      },
    };
    const explorer = new FileListExplorer(fixture, stateManager, {titleService});
    explorer.addRedirectToFolderCallback((id) => {
      assert.step(`Should call handler with: ${id}.`);
    });

    const folder = {
      id: 'mock-folder-id',
    };
    stateManager.stateChangedMock('rootFolder', folder);

    assert.verifySteps([
      'Should execute \'statechanged.rootFolder\' event handler.',
      `Should call handler with: ${folder.id}.`,
    ], 'Should properly handle root-folder event.');
  });

  test('should handle list-items-to-delete changed event.', (assert) => {
    assert.expect(3);

    const stateManager = new StateManagerMock(assert);
    const titleService = {
      setPage(page) {
      },
    };
    const explorer = new FileListExplorer(fixture, stateManager, {titleService});

    const listItems = [
      {
        id: 'mock-id',
        name: 'mock-name',
        type: 'file',
        size: 10,
      },
      {
        id: 'mock-id-2',
        name: 'mock-name',
        type: 'file',
        size: 10,
      },
    ];
    explorer.listComponent.listItems = listItems;
    const oldList = fixture.querySelector('[data-test="file-list"]').innerHTML;

    stateManager.stateChangedMock('listItemsToDelete', [listItems[0]]);
    const newList = fixture.querySelector('[data-test="file-list"]').innerHTML;

    assert.notStrictEqual(newList, oldList, 'Should rerender file list with new data.');

    assert.verifySteps([
      'Should execute \'statechanged.listItemsToDelete\' event handler.',
    ], 'Should properly handle list-items-to-delete event.');
  });

  test('should handle deletion authentication error.', (assert) => {
    assert.expect(4);

    const stateManager = new StateManagerMock(assert);
    const titleService = {
      setPage(page) {
      },
    };

    const toastService = {
      showError(message) {
        assert.step(`Error message: ${message}.`);
      },
    };
    const listExplorer = new FileListExplorer(fixture, stateManager, {titleService, toastService});
    listExplorer.onAuthenticationError(() => {
      assert.step('Should trigger AuthenticationError handler.');
    });

    stateManager.stateChangedMock('deletionIssue', {
      itemDeletionError: new AuthenticationError(),
    });

    assert.verifySteps([
      'Should execute \'statechanged.deletionIssue\' event handler.',
      'Error message: Please log in..',
      'Should trigger AuthenticationError handler.',
    ], 'Should handle deleting authentication error.');
  });

  test('should handle deletion resource-not-found error.', (assert) => {
    assert.expect(4);

    const stateManager = new StateManagerMock(assert);
    const titleService = {
      setPage(page) {
      },
    };

    const toastService = {
      showError(message) {
        assert.step(`Error message: ${message}.`);
      },
    };
    new FileListExplorer(fixture, stateManager, {titleService, toastService});

    const parentId = 'mock-parent-id';
    const notDeletedItem = {
      name: 'mock-name',
      parentId,
    };

    stateManager.setMockState({
      folder: {
        id: parentId,
      },
    });

    stateManager.stateChangedMock('deletionIssue', {
      itemDeletionError: new ResourceNotFoundError(),
      notDeletedItem,
    });

    assert.verifySteps([
      'Should execute \'statechanged.deletionIssue\' event handler.',
      `Error message: List item ${notDeletedItem.name} was not found..`,
      'Should call StateManager.dispatchAction(RefreshListAction).',
    ], 'Should handle deleting resource-not-found error.');
  });

  test('should handle deletion server error.', (assert) => {
    assert.expect(3);

    const stateManager = new StateManagerMock(assert);
    const titleService = {
      setPage(page) {
      },
    };

    const toastService = {
      showError(message) {
        assert.step(`Error message: ${message}.`);
      },
    };

    new FileListExplorer(fixture, stateManager, {titleService, toastService});

    const notDeletedItem = {
      name: 'mock-name',
    };

    stateManager.stateChangedMock('deletionIssue', {
      itemDeletionError: new GeneralServerError(),
      notDeletedItem,
    });

    assert.verifySteps([
      'Should execute \'statechanged.deletionIssue\' event handler.',
      `Error message: List item with name ${notDeletedItem.name} wasn\'t deleted..`,
    ], 'Should handle deleting server error.');
  });

  test('should handle renaming authentication error.', (assert) => {
    assert.expect(4);

    const stateManager = new StateManagerMock(assert);
    const titleService = {
      setPage(page) {
      },
    };

    const toastService = {
      showError(message) {
        assert.step(`Error message: ${message}.`);
      },
    };
    const listExplorer = new FileListExplorer(fixture, stateManager, {titleService, toastService});
    listExplorer.onAuthenticationError(() => {
      assert.step('Should trigger AuthenticationError handler.');
    });

    stateManager.stateChangedMock('renamingIssue', {
      itemRenamingError: new AuthenticationError(),
    });

    assert.verifySteps([
      'Should execute \'statechanged.renamingIssue\' event handler.',
      'Error message: Please log in..',
      'Should trigger AuthenticationError handler.',
    ], 'Should handle renaming authentication error.');
  });

  test('should handle renaming resource-not-found error.', (assert) => {
    assert.expect(4);

    const stateManager = new StateManagerMock(assert);
    const titleService = {
      setPage(page) {
      },
    };

    const toastService = {
      showError(message) {
        assert.step(`Error message: ${message}.`);
      },
    };
    new FileListExplorer(fixture, stateManager, {titleService, toastService});

    const parentId = 'mock-parent-id';
    const notRenamedItem = {
      name: 'mock-name',
      parentId,
    };

    stateManager.setMockState({
      folder: {
        id: parentId,
      },
    });

    stateManager.stateChangedMock('renamingIssue', {
      itemRenamingError: new ResourceNotFoundError(),
      notRenamedItem,
    });

    assert.verifySteps([
      'Should execute \'statechanged.renamingIssue\' event handler.',
      `Error message: List item ${notRenamedItem.name} was not found..`,
      'Should call StateManager.dispatchAction(RefreshListAction).',
    ], 'Should handle renaming resource-not-found error.');
  });

  test('should handle renaming server error.', (assert) => {
    assert.expect(3);

    const stateManager = new StateManagerMock(assert);
    const titleService = {
      setPage(page) {
      },
    };

    const toastService = {
      showError(message) {
        assert.step(`Error message: ${message}.`);
      },
    };

    new FileListExplorer(fixture, stateManager, {titleService, toastService});

    const notRenamedItem = {
      name: 'mock-name',
    };

    stateManager.stateChangedMock('renamingIssue', {
      itemRenamingError: new GeneralServerError(),
      notRenamedItem,
    });

    assert.verifySteps([
      'Should execute \'statechanged.renamingIssue\' event handler.',
      `Error message: List item with name ${notRenamedItem.name} wasn\'t renamed..`,
    ], 'Should handle renaming server error.');
  });

  test('should handle folder-creating authentication error.', (assert) => {
    assert.expect(4);

    const stateManager = new StateManagerMock(assert);
    const titleService = {
      setPage(page) {
      },
    };

    const toastService = {
      showError(message) {
        assert.step(`Error message: ${message}.`);
      },
    };
    const listExplorer = new FileListExplorer(fixture, stateManager, {titleService, toastService});
    listExplorer.onAuthenticationError(() => {
      assert.step('Should trigger AuthenticationError handler.');
    });

    stateManager.stateChangedMock('folderCreatingError', new AuthenticationError());

    assert.verifySteps([
      'Should execute \'statechanged.folderCreatingError\' event handler.',
      'Error message: Please log in..',
      'Should trigger AuthenticationError handler.',
    ], 'Should handle folder-creating authentication error.');
  });

  test('should handle folder-creating resource-not-found error.', (assert) => {
    assert.expect(4);

    const stateManager = new StateManagerMock(assert);
    const titleService = {
      setPage(page) {
      },
    };

    const toastService = {
      showError(message) {
        assert.step(`Error message: ${message}.`);
      },
    };
    const explorer = new FileListExplorer(fixture, stateManager, {titleService, toastService});
    explorer.onResourceNotFoundError((message, path) => {
      assert.step(`Should trigger resource-not-found with message: ${message} and path: ${path}.`);
    });
    const errorMessage = 'error message';
    stateManager.stateChangedMock('folderCreatingError', new ResourceNotFoundError(errorMessage));

    assert.verifySteps([
      'Should execute \'statechanged.folderCreatingError\' event handler.',
      `Error message: ${errorMessage}.`,
      'Should trigger resource-not-found with message: Parent folder and path: /folder.',
    ], 'Should handle folder-creating resource-not-found error.');
  });

  test('should handle folder-creating server error.', (assert) => {
    assert.expect(3);

    const stateManager = new StateManagerMock(assert);
    const titleService = {
      setPage(page) {
      },
    };

    const toastService = {
      showError(message) {
        assert.step(`Error message: ${message}.`);
      },
    };

    new FileListExplorer(fixture, stateManager, {titleService, toastService});

    stateManager.stateChangedMock('folderCreatingError', new GeneralServerError());

    assert.verifySteps([
      'Should execute \'statechanged.folderCreatingError\' event handler.',
      'Error message: Cannot create folder..',
    ], 'Should handle folder-creating server error.');
  });

  test('should handle uploading-file-issue authentication error.', (assert) => {
    assert.expect(4);

    const stateManager = new StateManagerMock(assert);
    const titleService = {
      setPage(page) {
      },
    };

    const toastService = {
      showError(message) {
        assert.step(`Error message: ${message}.`);
      },
    };
    const listExplorer = new FileListExplorer(fixture, stateManager, {titleService, toastService});
    listExplorer.onAuthenticationError(() => {
      assert.step('Should trigger AuthenticationError handler.');
    });

    stateManager.stateChangedMock('uploadingFileIssue', {
      error: new AuthenticationError(),
    });

    assert.verifySteps([
      'Should execute \'statechanged.uploadingFileIssue\' event handler.',
      'Error message: Please log in..',
      'Should trigger AuthenticationError handler.',
    ], 'Should handle uploading file issue authentication error.');
  });

  test('should handle uploading file resource-not-found error.', (assert) => {
    assert.expect(4);

    const stateManager = new StateManagerMock(assert);
    const titleService = {
      setPage(page) {
      },
    };

    const toastService = {
      showError(message) {
        assert.step(`Error message: ${message}.`);
      },
    };
    new FileListExplorer(fixture, stateManager, {titleService, toastService});

    const parentId = 'mock-parent-id';
    const parentFolder = {
      name: 'mock-name',
      id: parentId,
    };

    stateManager.setMockState({
      folder: {
        id: parentId,
      },
    });

    stateManager.stateChangedMock('uploadingFileIssue', {
      error: new ResourceNotFoundError(),
      parentFolder,
    });

    assert.verifySteps([
      'Should execute \'statechanged.uploadingFileIssue\' event handler.',
      `Error message: Parent folder ${parentFolder.name} was not found..`,
      'Should call StateManager.dispatchAction(RefreshListAction).',
    ], 'Should handle file uploading resource-not-found error.');
  });

  test('should handle file uploading server error.', (assert) => {
    assert.expect(3);

    const stateManager = new StateManagerMock(assert);
    const titleService = {
      setPage(page) {
      },
    };

    const toastService = {
      showError(message) {
        assert.step(`Error message: ${message}.`);
      },
    };

    new FileListExplorer(fixture, stateManager, {titleService, toastService});

    const notUploadedFileName = 'mock-name';

    stateManager.stateChangedMock('uploadingFileIssue', {
      error: new GeneralServerError(),
      notUploadedFileName,
    });

    assert.verifySteps([
      'Should execute \'statechanged.uploadingFileIssue\' event handler.',
      `Error message: File ${notUploadedFileName} wasn't uploaded..`,
    ], 'Should handle file uploading server error.');
  });

  test('should handle downloading-file-issue authentication error.', (assert) => {
    assert.expect(4);

    const stateManager = new StateManagerMock(assert);
    const titleService = {
      setPage(page) {
      },
    };

    const toastService = {
      showError(message) {
        assert.step(`Error message: ${message}.`);
      },
    };
    const listExplorer = new FileListExplorer(fixture, stateManager, {titleService, toastService});
    listExplorer.onAuthenticationError(() => {
      assert.step('Should trigger AuthenticationError handler.');
    });

    stateManager.stateChangedMock('downloadingFileIssue', {
      error: new AuthenticationError(),
    });

    assert.verifySteps([
      'Should execute \'statechanged.downloadingFileIssue\' event handler.',
      'Error message: Please log in..',
      'Should trigger AuthenticationError handler.',
    ], 'Should handle downloading file issue authentication error.');
  });

  test('should handle downloading file resource-not-found error.', (assert) => {
    assert.expect(4);

    const stateManager = new StateManagerMock(assert);
    const titleService = {
      setPage(page) {
      },
    };

    const toastService = {
      showError(message) {
        assert.step(`Error message: ${message}.`);
      },
    };
    new FileListExplorer(fixture, stateManager, {titleService, toastService});

    const parentId = 'mock-parent-id';
    const file = {
      name: 'mock-name',
      parentId,
    };

    stateManager.setMockState({
      folder: {
        id: parentId,
      },
    });

    stateManager.stateChangedMock('downloadingFileIssue', {
      error: new ResourceNotFoundError(),
      file,
    });

    assert.verifySteps([
      'Should execute \'statechanged.downloadingFileIssue\' event handler.',
      `Error message: File ${file.name} was not found..`,
      'Should call StateManager.dispatchAction(RefreshListAction).',
    ], 'Should handle file downloading resource-not-found error.');
  });

  test('should handle file downloading server error.', (assert) => {
    assert.expect(3);

    const stateManager = new StateManagerMock(assert);
    const titleService = {
      setPage(page) {
      },
    };

    const toastService = {
      showError(message) {
        assert.step(`Error message: ${message}.`);
      },
    };

    new FileListExplorer(fixture, stateManager, {titleService, toastService});

    const fileName = 'mock-name';

    stateManager.stateChangedMock('downloadingFileIssue', {
      error: new GeneralServerError(),
      file: {
        name: fileName,
      },
    });

    assert.verifySteps([
      'Should execute \'statechanged.downloadingFileIssue\' event handler.',
      `Error message: File ${fileName} wasn't downloaded..`,
    ], 'Should handle file downloading server error.');
  });

  test('should correctly dispatch action', async (assert) => {
    assert.expect(2);

    const stateManager = new StateManagerMock(assert);
    const titleService = {
      setPage(page) {
      },
    };
    const explorer = new FileListExplorer(fixture, stateManager, {titleService});
    const action = new ActionMock();
    await explorer.dispatch(action);

    assert.verifySteps([
      `Should call StateManager.dispatchAction(${ActionMock.name}).`,
    ], 'Should delegate dispatching action to StateManager.');
  });

  test('should correctly handle state-changed event', (assert) => {
    assert.expect(1);

    const mockFieldName = 'mock-field';
    const mockState = {
      [mockFieldName]: '',
    };
    const titleService = {
      setPage(page) {
      },
    };
    const stateManager = new StateManager(mockState, {apiService: null});
    const explorer = new FileListExplorer(fixture, stateManager, {titleService});
    explorer.onStateChanged(mockFieldName, (state) => {
      assert.deepEqual(state, mockState, 'Should pass state to state-changed event handler.');
    });
    stateManager.state[mockFieldName] = 'mock-state-field-value';
  });
});

/**
 * Mock for State Manager.
 */
class StateManagerMock {

  _stateChangedHandlers = [];

  _state = {};

  /**
   * Instantiates StateManagerMock.
   *
   * @param {Qunit.assert} assert - assertions object.
   */
  constructor(assert) {
    this.assert = assert;
  }

  onStateChanged(field, handler) {
    this._stateChangedHandlers[field] = (value) => {
      this.assert.step(`Should execute 'statechanged.${field}' event handler.`);
      handler({
        detail: {
          state: Object.assign({}, this._state, {
            [field]: value,
          }),
        },
      });
    };
  }

  /**
   * Mock method to trigger for state changed event.
   *
   * @param {string} field - state's field.
   * @param {*} value - expected value to pass to handler.
   */
  stateChangedMock(field, value) {
    this._stateChangedHandlers[field](value);
  }

  setMockState(state) {
    this._state = state;
  }

  get state() {
    return this._state;
  }

  /**
   * @inheritdoc
   */
  async dispatchAction(action) {
    this.assert.step(`Should call StateManager.dispatchAction(${action.constructor.name}).`);
  }
}

/**
 * Mock for Action.
 */
class ActionMock extends Action {

  async apply(stateManager) {
  }
}
