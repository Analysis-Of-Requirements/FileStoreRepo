import ApiService from '../../../app/services/api-service.js';
import UserCredentials from '../../../app/models/user-credentials.js';
import ServerValidationError from '../../../app/models/errors/server-validation-error.js';
import fetchMock from '../../../../node_modules/fetch-mock/esm/client.js';
import AuthenticationError from '../../../app/models/errors/authentication-error.js';
import GeneralServerError from '../../../app/models/errors/general-server-error.js';
import ResourceNotFoundError from '../../../app/models/errors/resource-not-found-error.js';

const {module, test} = QUnit;

export default module('Api Service', (hooks) => {

  hooks.afterEach(() => {
    fetchMock.restore();
  });

  test('should make successful log in request.', async (assert) => {
    assert.expect(4);
    const url = '/api/login';
    const token = 'token-string';

    fetchMock.post(url, {
      token,
    }, {
      repeat: 1,
    });

    const tokenService = new TokenServiceMock(assert);
    const service = new ApiService(tokenService);
    const userCredentials = new UserCredentials('Mike', 'Wazowski');

    await service.logIn(userCredentials);

    const expectedOptions = {
      method: 'POST',
      body: {
        login: userCredentials.login,
        password: userCredentials.password,
      },
    };

    assertCalledUrl(assert, url, expectedOptions);
    assertDone(assert);

    assert.verifySteps([
      `Should call TokenService.setToken(${token}).`,
    ], 'Should save token from resolved response.');
  });

  test('should resolve failed log in request.', async (assert) => {
    assert.expect(6);
    const url = '/api/login';
    const errorMessage = 'No user with such login.';

    fetchMock.post(url, {
      body: errorMessage,
      status: 401,
    }, {
      repeat: 1,
    });

    const tokenService = new TokenServiceMock(assert);
    const service = new ApiService(tokenService);
    const userCredentials = new UserCredentials('Mike', 'Wazowski');

    try {
      await service.logIn(userCredentials);
    } catch (error) {
      assert.ok(error instanceof AuthenticationError, 'Should throw AuthenticationError for rejected credentials.');
      assert.strictEqual(error.message, errorMessage, 'Should properly parse response message.');
    }

    const expectedOptions = {
      method: 'POST',
      body: {
        login: userCredentials.login,
        password: userCredentials.password,
      },
    };

    assertCalledUrl(assert, url, expectedOptions);
    assertDone(assert);

    assert.verifySteps([
      'Should delete token.',
    ], 'Should delete token for 401 response.');
  });

  test('should resolve successful registration request.', async (assert) => {
    assert.expect(2);
    const url = '/api/registration';

    fetchMock.post(url, {
      status: 200,
    }, {
      repeat: 1,
    });

    const tokenService = new TokenServiceMock(assert);
    const service = new ApiService(tokenService);
    const userCredentials = new UserCredentials('Mike', 'Wazowski');

    await service.register(userCredentials);

    const expectedOptions = {
      method: 'POST',
      body: {
        login: userCredentials.login,
        password: userCredentials.password,
      },
    };

    assertCalledUrl(assert, url, expectedOptions);
    assertDone(assert);
  });

  test('should resolve failed registration request.', async (assert) => {
    assert.expect(5);
    const url = '/api/registration';
    const expectedErrorField = 'login';
    const expectedErrorMessage = 'User with such login already exist.';

    fetchMock.post(url, {
      body: {
        validationErrors: [
          {
            field: expectedErrorField,
            message: expectedErrorMessage,
          },
        ],
      },
      status: 422,
    }, {
      repeat: 1,
    });

    const tokenService = new TokenServiceMock();
    const service = new ApiService(tokenService);
    const userCredentials = new UserCredentials('Mike', 'Wazowski');

    try {
      await service.register(userCredentials);
    } catch (error) {
      assert.ok(error instanceof ServerValidationError, 'Should throw ServerValidationError for rejected credentials.');
      assert.ok(error.hasErrorCase(expectedErrorField), 'Should throw error with at least one error case.');
      const errorMessage = error.getErrorCase(expectedErrorField).message;
      assert.strictEqual(errorMessage, expectedErrorMessage, 'Should throw error case with correct message.');
    }

    const expectedOptions = {
      method: 'POST',
      body: {
        login: userCredentials.login,
        password: userCredentials.password,
      },
    };

    assertCalledUrl(assert, url, expectedOptions);
    assertDone(assert);
  });

  test('should resolve successful \'getFolderContent()\' request.', async (assert) => {
    assert.expect(5);

    const url = 'express:/api/folder/:folderId/content';
    const id = 'mock-folder-id';
    const folder = {
      name: 'summer',
      id,
      type: 'folder',
      fileType: null,
      size: null,
      itemsAmount: 13,
      parentId: 'mock-parentId',
    };

    fetchMock.get(url, {
      listItems: [folder],
    }, {
      params: {
        folderId: id,
      },
      repeat: 1,
    });

    const tokenService = new TokenServiceMock(assert);
    const service = new ApiService(tokenService);

    const response = await service.getFolderContent(id);
    assert.deepEqual(response, {
      listItems: [folder],
    }, 'Should properly parse returned response.');

    const expectedOptions = {
      method: 'GET',
      header: {
        'Authentication': `Bearer 'mock-access-token'`,
      },
    };

    assertCalledUrl(assert, url, expectedOptions);
    assertDone(assert);

    assert.verifySteps([
      'Should call TokenService.getToken().',
    ], 'Should use token service to access token.');
  });

  test('should handle authentication error response of \'getFolderContent()\' request.', async (assert) => {
    assert.expect(4);

    const url = 'express:/api/folder/:folderId/content';
    const folderId = 'mock-folder-id';
    const errorMessage = 'Authentication error.';

    fetchMock.get(url, {
      body: errorMessage,
      status: 401,
    }, {
      params: {
        folderId,
      },
      repeat: 1,
    });

    const tokenService = new TokenServiceMock();
    const service = new ApiService(tokenService);

    try {
      await service.getFolderContent(folderId);
    } catch (error) {
      assert.ok(error instanceof AuthenticationError,
        'Should throw Authentication if server responded with 401 status.',
      );
      assert.strictEqual(error.message, errorMessage, 'Should properly parse response message.');
    }

    const expectedOptions = {
      method: 'GET',
      header: {
        'Authentication': 'Bearer mock-access-token',
      },
    };

    assertCalledUrl(assert, url, expectedOptions);
    assertDone(assert);
  });

  test('should resolve \'not-found-resource\' response of \'getFolderContent()\' request.', async (assert) => {
    assert.expect(4);

    const url = 'express:/api/folder/:folderId/content';
    const folderId = 'mock-folder-id';
    const errorMessage = 'Such resource doesn\'t exist.';

    fetchMock.get(url, {
      body: errorMessage,
      status: 404,
    }, {
      params: {
        folderId,
      },
      repeat: 1,
    });

    const tokenService = new TokenServiceMock();
    const service = new ApiService(tokenService);

    try {
      await service.getFolderContent(folderId);
    } catch (error) {
      assert.ok(error instanceof ResourceNotFoundError,
        'Should throw ResourceNotFoundError if resource is not found.',
      );
      assert.strictEqual(error.message, errorMessage, 'Should properly parse response message.');
    }

    const expectedOptions = {
      method: 'GET',
      header: {
        'Authentication': 'Bearer mock-access-token',
      },
    };

    assertCalledUrl(assert, url, expectedOptions);
    assertDone(assert);
  });

  test('should resolve successful \'getFolder()\' request.', async (assert) => {
    assert.expect(5);

    const url = 'express:/api/folder/:folderId';
    const id = 'mock-folder-id';
    const folder = {
      name: 'summer',
      id,
      type: 'folder',
      fileType: null,
      size: null,
      itemsAmount: 13,
      parentId: 'mock-parentId',
    };

    fetchMock.get(url, folder, {
      params: {
        folderId: id,
      },
      repeat: 1,
    });

    const tokenService = new TokenServiceMock(assert);
    const service = new ApiService(tokenService);

    const response = await service.getFolder(id);
    assert.deepEqual(response, folder, 'Should properly parse returned folder.');

    const expectedOptions = {
      method: 'GET',
      header: {
        'Authentication': `Bearer 'mock-access-token'`,
      },
    };

    assertCalledUrl(assert, url, expectedOptions);
    assertDone(assert);

    assert.verifySteps([
      'Should call TokenService.getToken().',
    ], 'Should use token service to access token.');
  });

  test('should resolve \'authentication\' response of \'getFolder()\' request.', async (assert) => {
    assert.expect(4);

    const url = 'express:/api/folder/:folderId';
    const folderId = 'mock-folder-id';
    const errorMessage = 'Authentication error.';

    fetchMock.get(url, {
      body: errorMessage,
      status: 401,
    }, {
      params: {
        folderId,
      },
      repeat: 1,
    });

    const tokenService = new TokenServiceMock();
    const service = new ApiService(tokenService);

    try {
      await service.getFolder(folderId);
    } catch (error) {
      assert.ok(error instanceof AuthenticationError,
        'Should throw Authentication if server responded with 401 status.',
      );
      assert.strictEqual(error.message, errorMessage, 'Should properly parse response message.');
    }

    const expectedOptions = {
      method: 'GET',
      header: {
        'Authentication': 'Bearer mock-access-token',
      },
    };

    assertCalledUrl(assert, url, expectedOptions);
    assertDone(assert);
  });

  test('should resolve \'not-found-resource\' response of \'getFolder()\' request.', async (assert) => {
    assert.expect(4);

    const url = 'express:/api/folder/:folderId';
    const folderId = 'mock-folder-id';
    const errorMessage = 'Such resource doesn\'t exist.';

    fetchMock.get(url, {
      body: errorMessage,
      status: 404,
    }, {
      params: {
        folderId,
      },
      repeat: 1,
    });

    const tokenService = new TokenServiceMock();
    const service = new ApiService(tokenService);

    try {
      await service.getFolder(folderId);
    } catch (error) {
      assert.ok(error instanceof ResourceNotFoundError,
        'Should throw ResourceNotFoundError if resource is not found.',
      );
      assert.strictEqual(error.message, errorMessage, 'Should properly parse response message.');
    }

    const expectedOptions = {
      method: 'GET',
      header: {
        'Authentication': 'Bearer mock-access-token',
      },
    };

    assertCalledUrl(assert, url, expectedOptions);
    assertDone(assert);
  });

  test('should resolve successful \'getRootFolder()\' request.', async (assert) => {
    assert.expect(5);

    const url = 'express:/api/folder/:folderId';
    const id = 'root';
    const folder = {
      name: 'summer',
      id,
      type: 'folder',
      fileType: null,
      size: null,
      itemsAmount: 13,
      parentId: 'mock-parentId',
    };

    fetchMock.get(url, folder, {
      params: {
        folderId: id,
      },
      repeat: 1,
    });

    const tokenService = new TokenServiceMock(assert);
    const service = new ApiService(tokenService);

    const response = await service.getRootFolder();
    assert.deepEqual(response, folder, 'Should properly parse returned root folder.');

    const expectedOptions = {
      method: 'GET',
      header: {
        'Authentication': `Bearer 'mock-access-token'`,
      },
    };

    assertCalledUrl(assert, url, expectedOptions);
    assertDone(assert);

    assert.verifySteps([
      'Should call TokenService.getToken().',
    ], 'Should use token service to access token.');
  });

  test('should resolve authentication error response of \'getRootFolder()\' request.', async (assert) => {
    assert.expect(4);

    const url = 'express:/api/folder/:folderId';
    const errorMessage = 'Authentication error.';

    fetchMock.get(url, {
      body: errorMessage,
      status: 401,
    }, {
      params: {
        folderId: 'root',
      },
      repeat: 1,
    });

    const tokenService = new TokenServiceMock();
    const service = new ApiService(tokenService);

    try {
      await service.getRootFolder();
    } catch (error) {
      assert.ok(error instanceof AuthenticationError,
        'Should throw Authentication if server responded with 401 status.',
      );
      assert.strictEqual(error.message, errorMessage, 'Should properly parse response message.');
    }

    const expectedOptions = {
      method: 'GET',
      header: {
        'Authentication': 'Bearer mock-access-token',
      },
    };

    assertCalledUrl(assert, url, expectedOptions);
    assertDone(assert);
  });

  test('should resolve not-found-resource error response of \'getRootFolder()\' request.', async (assert) => {
    assert.expect(4);

    const url = 'express:/api/folder/:folderId';
    const errorMessage = 'Such resource doesn\'t exist.';

    fetchMock.get(url, {
      body: errorMessage,
      status: 404,
    }, {
      params: {
        folderId: 'root',
      },
      repeat: 1,
    });

    const tokenService = new TokenServiceMock();
    const service = new ApiService(tokenService);

    try {
      await service.getRootFolder();
    } catch (error) {
      assert.ok(error instanceof ResourceNotFoundError,
        'Should throw ResourceNotFoundError if resource is not found.',
      );
      assert.strictEqual(error.message, errorMessage, 'Should properly parse response message.');
    }

    const expectedOptions = {
      method: 'GET',
      header: {
        'Authentication': 'Bearer mock-access-token',
      },
    };

    assertCalledUrl(assert, url, expectedOptions);
    assertDone(assert);
  });

  test('should resolve successful \'deleteListItem()\' request.', async (assert) => {
    assert.expect(4);

    const url = 'express:/api/folder/:folderId';
    const folder = {
      name: 'summer',
      id: 'mock-id',
      type: 'folder',
      fileType: null,
      size: null,
      itemsAmount: 13,
      parentId: 'mock-parentId',
    };

    fetchMock.delete(url, folder, {
      params: {
        folderId: folder.id,
      },
      repeat: 1,
    });

    const tokenService = new TokenServiceMock(assert);
    const service = new ApiService(tokenService);

    await service.deleteListItem(folder);

    const expectedOptions = {
      method: 'DELETE',
      header: {
        'Authentication': `Bearer 'mock-access-token'`,
      },
    };

    assertCalledUrl(assert, url, expectedOptions);
    assertDone(assert);

    assert.verifySteps([
      'Should call TokenService.getToken().',
    ], 'Should use token service to access token.');
  });

  test('should resolve authentication error response of \'deleteListItem()\' request.', async (assert) => {
    assert.expect(4);

    const url = 'express:/api/folder/:folderId';
    const errorMessage = 'Authentication error.';
    const listItem = {
      type: 'folder',
      id: 'mock-id',
    };

    fetchMock.delete(url, {
      body: errorMessage,
      status: 401,
    }, {
      params: {
        folderId: listItem.id,
      },
      repeat: 1,
    });

    const tokenService = new TokenServiceMock();
    const service = new ApiService(tokenService);

    try {
      await service.deleteListItem(listItem);
    } catch (error) {
      assert.ok(error instanceof AuthenticationError,
        'Should throw Authentication if server responded with 401 status.',
      );
      assert.strictEqual(error.message, errorMessage, 'Should properly parse response message.');
    }

    const expectedOptions = {
      method: 'DELETE',
      header: {
        'Authentication': 'Bearer mock-access-token',
      },
    };

    assertCalledUrl(assert, url, expectedOptions);
    assertDone(assert);
  });

  test('should resolve not-found-resource error response of \'deleteListItem()\' request.', async (assert) => {
    assert.expect(4);

    const url = 'express:/api/folder/:folderId';
    const errorMessage = 'Such resource doesn\'t exist.';
    const listItem = {
      type: 'folder',
      id: 'mock-id',
    };

    fetchMock.delete(url, {
      body: errorMessage,
      status: 404,
    }, {
      params: {
        folderId: listItem.id,
      },
      repeat: 1,
    });

    const tokenService = new TokenServiceMock();
    const service = new ApiService(tokenService);

    try {
      await service.deleteListItem(listItem);
    } catch (error) {
      assert.ok(error instanceof ResourceNotFoundError,
        'Should throw ResourceNotFoundError if resource is not found.',
      );
      assert.strictEqual(error.message, errorMessage, 'Should properly parse response message.');
    }

    const expectedOptions = {
      method: 'DELETE',
      header: {
        'Authentication': 'Bearer mock-access-token',
      },
    };

    assertCalledUrl(assert, url, expectedOptions);
    assertDone(assert);
  });

  test('should resolve successful \'updateListItem()\' request.', async (assert) => {
    assert.expect(4);

    const url = 'express:/api/folder/:folderId';
    const folder = {
      name: 'summer',
      id: 'mock-id',
      type: 'folder',
    };

    fetchMock.put(url, folder, {
      params: {
        folderId: folder.id,
      },
      repeat: 1,
    });

    const tokenService = new TokenServiceMock(assert);
    const service = new ApiService(tokenService);

    await service.updateListItem(folder);

    const expectedOptions = {
      method: 'PUT',
      header: {
        'Authentication': `Bearer 'mock-access-token'`,
      },
    };

    assertCalledUrl(assert, url, expectedOptions);
    assertDone(assert);

    assert.verifySteps([
      'Should call TokenService.getToken().',
    ], 'Should use token service to access token.');
  });

  test('should resolve authentication error response of \'updateListItem()\' request.', async (assert) => {
    assert.expect(4);

    const url = 'express:/api/folder/:folderId';
    const errorMessage = 'Authentication error.';
    const listItem = {
      type: 'folder',
      id: 'mock-id',
    };

    fetchMock.put(url, {
      body: errorMessage,
      status: 401,
    }, {
      params: {
        folderId: listItem.id,
      },
      repeat: 1,
    });

    const tokenService = new TokenServiceMock();
    const service = new ApiService(tokenService);

    try {
      await service.updateListItem(listItem);
    } catch (error) {
      assert.ok(error instanceof AuthenticationError,
        'Should throw Authentication if server responded with 401 status.',
      );
      assert.strictEqual(error.message, errorMessage, 'Should properly parse response message.');
    }

    const expectedOptions = {
      method: 'PUT',
      header: {
        'Authentication': 'Bearer mock-access-token',
      },
    };

    assertCalledUrl(assert, url, expectedOptions);
    assertDone(assert);
  });

  test('should resolve not-found-resource error response of \'updateListItem()\' request.', async (assert) => {
    assert.expect(4);

    const url = 'express:/api/folder/:folderId';
    const errorMessage = 'Such resource doesn\'t exist.';
    const listItem = {
      type: 'folder',
      id: 'mock-id',
    };

    fetchMock.put(url, {
      body: errorMessage,
      status: 404,
    }, {
      params: {
        folderId: listItem.id,
      },
      repeat: 1,
    });

    const tokenService = new TokenServiceMock();
    const service = new ApiService(tokenService);

    try {
      await service.updateListItem(listItem);
    } catch (error) {
      assert.ok(error instanceof ResourceNotFoundError,
        'Should throw ResourceNotFoundError if resource is not found.',
      );
      assert.strictEqual(error.message, errorMessage, 'Should properly parse response message.');
    }

    const expectedOptions = {
      method: 'PUT',
      header: {
        'Authentication': 'Bearer mock-access-token',
      },
    };

    assertCalledUrl(assert, url, expectedOptions);
    assertDone(assert);
  });

  test('should resolve successful \'createFolder()\' request.', async (assert) => {
    assert.expect(4);

    const url = 'express:/api/folder/:folderId/folder';
    const folder = {
      name: 'summer',
      id: 'mock-id',
      type: 'folder',
      parentId: 'parent-folder-id',
    };

    fetchMock.post(url, folder, {
      params: {
        folderId: folder.parentId,
      },
      repeat: 1,
    });

    const tokenService = new TokenServiceMock(assert);
    const service = new ApiService(tokenService);

    await service.createFolder(folder.parentId);

    const expectedOptions = {
      method: 'POST',
      header: {
        'Authentication': `Bearer 'mock-access-token'`,
      },
    };

    assertCalledUrl(assert, url, expectedOptions);
    assertDone(assert);

    assert.verifySteps([
      'Should call TokenService.getToken().',
    ], 'Should use token service to access token.');
  });

  test('should resolve authentication error response of \'createFolder()\' request.', async (assert) => {
    assert.expect(4);

    const url = 'express:/api/folder/:folderId/folder';
    const errorMessage = 'Authentication error.';
    const folder = {
      type: 'folder',
      id: 'mock-id',
      parentId: 'parent-folder-id',
    };

    fetchMock.post(url, {
      body: errorMessage,
      status: 401,
    }, {
      params: {
        folderId: folder.parentId,
      },
      repeat: 1,
    });

    const tokenService = new TokenServiceMock();
    const service = new ApiService(tokenService);

    try {
      await service.createFolder(folder.parentId);
    } catch (error) {
      assert.ok(error instanceof AuthenticationError,
        'Should throw Authentication if server responded with 401 status.',
      );
      assert.strictEqual(error.message, errorMessage, 'Should properly parse response message.');
    }

    const expectedOptions = {
      method: 'POST',
      header: {
        'Authentication': 'Bearer mock-access-token',
      },
    };

    assertCalledUrl(assert, url, expectedOptions);
    assertDone(assert);
  });

  test('should resolve not-found-resource error response of \'createFolder()\' request.', async (assert) => {
    assert.expect(4);

    const url = 'express:/api/folder/:folderId/folder';
    const errorMessage = 'Parent folder doesn\'t exist.';
    const folder = {
      type: 'folder',
      id: 'mock-id',
      parentId: 'parent-folder-id',
    };

    fetchMock.post(url, {
      body: errorMessage,
      status: 404,
    }, {
      params: {
        folderId: folder.parentId,
      },
      repeat: 1,
    });

    const tokenService = new TokenServiceMock();
    const service = new ApiService(tokenService);

    try {
      await service.createFolder(folder.parentId);
    } catch (error) {
      assert.ok(error instanceof ResourceNotFoundError,
        'Should throw ResourceNotFoundError if resource is not found.',
      );
      assert.strictEqual(error.message, errorMessage, 'Should properly parse response message.');
    }

    const expectedOptions = {
      method: 'POST',
      header: {
        'Authentication': 'Bearer mock-access-token',
      },
    };

    assertCalledUrl(assert, url, expectedOptions);
    assertDone(assert);
  });

  test('should resolve successful \'uploadFile()\' request.', async (assert) => {
    assert.expect(5);

    const url = 'express:/api/folder/:folderId/file';
    const fileMetaData = {
      id: 'file-id-mock',
    };
    const folder = {
      id: 'mock-id',
    };

    fetchMock.post(url, fileMetaData, {
      params: {
        folderId: folder.id,
      },
      repeat: 1,
    });

    const tokenService = new TokenServiceMock(assert);
    const service = new ApiService(tokenService);

    const file = new File([], 'mock-file-name');
    const fileResponse = await service.uploadFile(folder, file);
    assert.deepEqual(fileResponse, fileMetaData, 'Should properly parse returned file.');

    const expectedOptions = {
      method: 'POST',
      header: {
        'Authentication': `Bearer 'mock-access-token'`,
      },
    };

    assertCalledUrl(assert, url, expectedOptions);
    assertDone(assert);

    assert.verifySteps([
      'Should call TokenService.getToken().',
    ], 'Should use token service to access token.');
  });

  test('should resolve authentication error response of \'uploadFile()\' request.', async (assert) => {
    assert.expect(4);

    const url = 'express:/api/folder/:folderId/file';
    const errorMessage = 'Authentication error.';
    const folder = {
      id: 'mock-id',
    };

    fetchMock.post(url, {
      body: errorMessage,
      status: 401,
    }, {
      params: {
        folderId: folder.id,
      },
      repeat: 1,
    });

    const tokenService = new TokenServiceMock();
    const service = new ApiService(tokenService);

    try {
      await service.uploadFile(folder, {});
    } catch (error) {
      assert.ok(error instanceof AuthenticationError,
        'Should throw Authentication if server responded with 401 status.',
      );
      assert.strictEqual(error.message, errorMessage, 'Should properly parse response message.');
    }

    const expectedOptions = {
      method: 'POST',
      header: {
        'Authentication': 'Bearer mock-access-token',
      },
    };

    assertCalledUrl(assert, url, expectedOptions);
    assertDone(assert);
  });

  test('should resolve not-found-resource error response of \'uploadFile()\' request.', async (assert) => {
    assert.expect(4);

    const url = 'express:/api/folder/:folderId/file';
    const errorMessage = 'Parent folder doesn\'t exist.';
    const folder = {
      id: 'mock-id',
    };

    fetchMock.post(url, {
      body: errorMessage,
      status: 404,
    }, {
      params: {
        folderId: folder.id,
      },
      repeat: 1,
    });

    const tokenService = new TokenServiceMock();
    const service = new ApiService(tokenService);

    try {
      await service.uploadFile(folder, {});
    } catch (error) {
      assert.ok(error instanceof ResourceNotFoundError,
        'Should throw ResourceNotFoundError if resource is not found.',
      );
      assert.strictEqual(error.message, errorMessage, 'Should properly parse response message.');
    }

    const expectedOptions = {
      method: 'POST',
      header: {
        'Authentication': 'Bearer mock-access-token',
      },
    };

    assertCalledUrl(assert, url, expectedOptions);
    assertDone(assert);
  });

  test('should resolve successful \'getUser()\' request.', async (assert) => {
    assert.expect(4);

    const url = 'express:/api/user';
    const user = {
      name: 'mock-name',
      id: 'mock-id',
    };

    fetchMock.get(url, user, {
      repeat: 1,
    });

    const tokenService = new TokenServiceMock(assert);
    const service = new ApiService(tokenService);

    await service.getUser();

    const expectedOptions = {
      method: 'GET',
      header: {
        'Authentication': `Bearer 'mock-access-token'`,
      },
    };

    assertCalledUrl(assert, url, expectedOptions);
    assertDone(assert);

    assert.verifySteps([
      'Should call TokenService.getToken().',
    ], 'Should use token service to access token.');
  });

  test('should resolve authentication error response of \'getUser()\' request.', async (assert) => {
    assert.expect(4);

    const url = 'express:/api/user';
    const errorMessage = 'Authentication error.';

    fetchMock.get(url, {
      body: errorMessage,
      status: 401,
    }, {
      repeat: 1,
    });

    const tokenService = new TokenServiceMock();
    const service = new ApiService(tokenService);

    try {
      await service.getUser();
    } catch (error) {
      assert.ok(error instanceof AuthenticationError,
        'Should throw Authentication if server responded with 401 status.',
      );
      assert.strictEqual(error.message, errorMessage, 'Should properly parse response message.');
    }

    const expectedOptions = {
      method: 'GET',
      header: {
        'Authentication': 'Bearer mock-access-token',
      },
    };

    assertCalledUrl(assert, url, expectedOptions);
    assertDone(assert);
  });

  test('should resolve not-found-resource error response of \'getUser()\' request.', async (assert) => {
    assert.expect(4);

    const url = 'express:/api/user';
    const errorMessage = 'User doesn\'t exist.';

    fetchMock.get(url, {
      body: errorMessage,
      status: 404,
    }, {
      repeat: 1,
    });

    const tokenService = new TokenServiceMock();
    const service = new ApiService(tokenService);

    try {
      await service.getUser();
    } catch (error) {
      assert.ok(error instanceof ResourceNotFoundError,
        'Should throw ResourceNotFoundError if resource is not found.',
      );
      assert.strictEqual(error.message, errorMessage, 'Should properly parse response message.');
    }

    const expectedOptions = {
      method: 'GET',
      header: {
        'Authentication': 'Bearer mock-access-token',
      },
    };

    assertCalledUrl(assert, url, expectedOptions);
    assertDone(assert);
  });

  test('should resolve successful \'logOut()\' request.', async (assert) => {
    assert.expect(5);

    const url = '/api/logout';
    fetchMock.post(url, {
      status: 200,
    }, {
      repeat: 1,
    });

    const tokenService = new TokenServiceMock(assert);
    const service = new ApiService(tokenService);

    await service.logOut();

    const expectedOptions = {
      method: 'POST',
      header: {
        'Authentication': 'Bearer mock-access-token',
      },
    };

    assertCalledUrl(assert, url, expectedOptions);
    assertDone(assert);

    assert.verifySteps([
      'Should call TokenService.getToken().',
      'Should delete token.',
    ], 'Should properly use TokenService.');
  });

  test('should resolve successful \'getFileContent()\' request.', async (assert) => {
    assert.expect(5);

    const id = '123';
    const url = 'express:/api/file/:id';
    const fileType = 'text/plain';
    const mockText = '110101010110';
    const fileContent = new Blob([mockText], {type: fileType});

    fetchMock.get(url, {
      headers: {
        'Content-Type': fileType,
      },
      status: 200,
      body: fileContent,
    }, {
      params: {
        id,
      },
      repeat: 1,
      sendAsJson: false,
    });

    const tokenService = new TokenServiceMock(assert);
    const service = new ApiService(tokenService);

    const blob = await service.getFileContent(id);
    assert.deepEqual(await blob.text(), mockText, 'Should properly process returned response.');

    const expectedOptions = {
      method: 'GET',
      header: {
        'Authentication': 'Bearer mock-access-token',
      },
    };

    assertCalledUrl(assert, url, expectedOptions);
    assertDone(assert);

    assert.verifySteps([
      'Should call TokenService.getToken().',
    ], 'Should properly use TokenService.');
  });

  test('should resolve \'authentication-error\' response of \'getFileContent()\' request.', async (assert) => {
    assert.expect(4);

    const id = '123';
    const url = 'express:/api/file/:id';
    const errorMessage = 'authentication error';

    fetchMock.get(url, {
      body: errorMessage,
      status: 401,
    }, {
      params: {
        id,
      },
      repeat: 1,
    });

    const tokenService = new TokenServiceMock();
    const service = new ApiService(tokenService);

    try {
      await service.getFileContent(id);
    } catch (error) {
      assert.ok(error instanceof AuthenticationError,
        'Should throw Authentication if server responded with 401 status.',
      );
      assert.strictEqual(error.message, errorMessage, 'Should properly parse response message.');
    }

    const expectedOptions = {
      method: 'GET',
      header: {
        'Authentication': 'Bearer mock-access-token',
      },
    };

    assertCalledUrl(assert, url, expectedOptions);
    assertDone(assert);
  });

  test('should resolve \'not-found-resource\' response of \'getFileContent()\' request.', async (assert) => {
    assert.expect(4);

    const id = '123';
    const url = 'express:/api/file/:id';
    const errorMessage = 'Such resource doesn\'t exist.';

    fetchMock.get(url, {
      body: errorMessage,
      status: 404,
    }, {
      params: {
        id,
      },
      repeat: 1,
    });

    const tokenService = new TokenServiceMock();
    const service = new ApiService(tokenService);

    try {
      await service.getFileContent(id);
    } catch (error) {
      assert.ok(error instanceof ResourceNotFoundError,
        'Should throw ResourceNotFoundError if resource is not found.',
      );
      assert.strictEqual(error.message, errorMessage, 'Should properly parse response message.');
    }

    const expectedOptions = {
      method: 'GET',
      header: {
        'Authentication': 'Bearer mock-access-token',
      },
    };

    assertCalledUrl(assert, url, expectedOptions);
    assertDone(assert);
  });

  test('should handle server error of logIn request.', async (assert) => {
    assert.expect(3);

    const tokenService = new TokenServiceMock(assert);
    const service = new ApiService(tokenService);
    const userCredentials = new UserCredentials('Mike', 'Wazowski');
    const matcher = '/api/login';

    fetchMock.post(matcher, {
      body: {
        message: 'Internal Server Error.',
      },
      status: 500,
    }, {
      repeat: 1,
    });

    await testGeneralServerError(assert, matcher,
      () => service.logIn(userCredentials),
      {
        method: 'POST',
        body: {
          login: userCredentials.login,
          password: userCredentials.password,
        },
      },
    );

    assertDone(assert);
  });

  test('should handle server error of registration request.', async (assert) => {
    assert.expect(3);

    const tokenService = new TokenServiceMock(assert);
    const service = new ApiService(tokenService);
    const userCredentials = new UserCredentials('Mike', 'Wazowski');
    const matcher = '/api/registration';

    fetchMock.post(matcher, {
      body: {
        message: 'Internal Server Error.',
      },
      status: 500,
    }, {
      repeat: 1,
    });

    await testGeneralServerError(assert, matcher,
      () => service.register(userCredentials),
      {
        method: 'POST',
        body: {
          login: userCredentials.login,
          password: userCredentials.password,
        },
      },
    );

    assertDone(assert);
  });

  test('should handle server error of folder content request.', async (assert) => {
    assert.expect(3);

    const tokenService = new TokenServiceMock();
    const service = new ApiService(tokenService);
    const folderId = 'mock-folder-id';
    const matcher = 'express:/api/folder/:folderId/content';

    fetchMock.get(matcher, {
      body: {
        message: 'Internal Server Error.',
      },
      status: 500,
    }, {
      params: {
        folderId,
      },
      repeat: 1,
    });

    await testGeneralServerError(assert, matcher,
      () => service.getFolderContent(folderId),
      {
        method: 'GET',
        header: {
          Authorization: 'Bearer mock-access-token',
        },
      },
    );

    assertDone(assert);
  });

  test('should handle server error of folder request.', async (assert) => {
    assert.expect(3);

    const tokenService = new TokenServiceMock();
    const service = new ApiService(tokenService);
    const folderId = 'mock-folder-id';
    const matcher = 'express:/api/folder/:folderId';

    fetchMock.get(matcher, {
      body: {
        message: 'Internal Server Error.',
      },
      status: 500,
    }, {
      params: {
        folderId,
      },
      repeat: 1,
    });

    await testGeneralServerError(assert, matcher,
      () => service.getFolder(folderId),
      {
        method: 'GET',
        header: {
          Authorization: 'Bearer mock-access-token',
        },
      },
    );

    assertDone(assert);
  });

  test('should handle server error of root folder request.', async (assert) => {
    assert.expect(3);

    const tokenService = new TokenServiceMock();
    const service = new ApiService(tokenService);
    const matcher = 'express:/api/folder/:folderId';

    fetchMock.get(matcher, {
      body: {
        message: 'Internal Server Error.',
      },
      status: 500,
    }, {
      params: {
        folderId: 'root',
      },
      repeat: 1,
    });

    await testGeneralServerError(assert, matcher,
      () => service.getRootFolder(),
      {
        method: 'GET',
        header: {
          Authorization: 'Bearer mock-access-token',
        },
      },
    );

    assertDone(assert);
  });

  test('should handle server error of delete list item request.', async (assert) => {
    assert.expect(3);

    const tokenService = new TokenServiceMock();
    const service = new ApiService(tokenService);
    const matcher = 'express:/api/folder/:folderId';
    const listItem = {
      type: 'folder',
      id: 'mock-id',
    };

    fetchMock.delete(matcher, {
      body: {
        message: 'Internal Server Error.',
      },
      status: 500,
    }, {
      params: {
        folderId: listItem.id,
      },
      repeat: 1,
    });

    await testGeneralServerError(assert, matcher,
      () => service.deleteListItem(listItem),
      {
        method: 'DELETE',
        header: {
          Authorization: 'Bearer mock-access-token',
        },
      },
    );

    assertDone(assert);
  });

  test('should handle server error of update list item request.', async (assert) => {
    assert.expect(3);

    const tokenService = new TokenServiceMock();
    const service = new ApiService(tokenService);
    const matcher = 'express:/api/folder/:folderId';
    const listItem = {
      type: 'folder',
      id: 'mock-id',
    };

    fetchMock.put(matcher, {
      body: {
        message: 'Internal Server Error.',
      },
      status: 500,
    }, {
      params: {
        folderId: listItem.id,
      },
      repeat: 1,
    });

    await testGeneralServerError(assert, matcher,
      () => service.updateListItem(listItem),
      {
        method: 'PUT',
        header: {
          Authorization: 'Bearer mock-access-token',
        },
      },
    );

    assertDone(assert);
  });

  test('should handle server error of log-out request.', async (assert) => {
    assert.expect(3);

    const tokenService = new TokenServiceMock();
    const service = new ApiService(tokenService);
    const matcher = 'express:/api/logout';

    fetchMock.post(matcher, {
      status: 500,
    }, {
      repeat: 1,
    });

    await testGeneralServerError(assert, matcher,
      () => service.logOut(),
      {
        method: 'POST',
        header: {
          Authorization: 'Bearer mock-access-token',
        },
      },
    );

    assertDone(assert);
  });

  test('should handle server error of create folder request.', async (assert) => {
    assert.expect(3);

    const tokenService = new TokenServiceMock();
    const service = new ApiService(tokenService);
    const matcher = 'express:/api/folder/:folderId/folder';
    const folder = {
      type: 'folder',
      id: 'mock-id',
      parentId: 'parent-folder-id',
    };

    fetchMock.post(matcher, {
      status: 500,
    }, {
      params: {
        folderId: folder.parentId,
      },
      repeat: 1,
    });

    await testGeneralServerError(assert, matcher,
      () => service.createFolder(folder.parentId),
      {
        method: 'POST',
        header: {
          Authorization: 'Bearer mock-access-token',
        },
      },
    );

    assertDone(assert);
  });

  test('should handle server error of get user request.', async (assert) => {
    assert.expect(3);

    const tokenService = new TokenServiceMock();
    const service = new ApiService(tokenService);
    const matcher = 'express:/api/user';

    fetchMock.get(matcher, {
      status: 500,
    }, {
      repeat: 1,
    });

    await testGeneralServerError(assert, matcher,
      () => service.getUser(),
      {
        method: 'GET',
        header: {
          Authorization: 'Bearer mock-access-token',
        },
      },
    );

    assertDone(assert);
  });

  test('should handle server error of upload file request.', async (assert) => {
    assert.expect(3);

    const tokenService = new TokenServiceMock();
    const service = new ApiService(tokenService);
    const matcher = 'express:/api/folder/:folderId/file';
    const folder = {
      id: 'mock-id',
    };

    fetchMock.post(matcher, {
      status: 500,
    }, {
      params: {
        folderId: folder.id,
      },
      repeat: 1,
    });

    await testGeneralServerError(assert, matcher,
      () => service.uploadFile(folder, new File([], 'mock-name')),
      {
        method: 'POST',
        header: {
          Authorization: 'Bearer mock-access-token',
        },
      },
    );

    assertDone(assert);
  });

  test('should handle server error of get file content request.', async (assert) => {
    assert.expect(3);

    const tokenService = new TokenServiceMock();
    const service = new ApiService(tokenService);
    const matcher = 'express:/api/file/:id';
    const id = 'mock-id';

    fetchMock.get(matcher, {
      status: 500,
    }, {
      params: {
        id,
      },
      repeat: 1,
    });

    await testGeneralServerError(assert, matcher,
      () => service.getFileContent(id),
      {
        method: 'GET',
        header: {
          Authorization: 'Bearer mock-access-token',
        },
      },
    );

    assertDone(assert);
  });
});

/**
 * Tests callback to handle General Server Error from server.
 *
 * @param {Qunit.assert} assert - assertions object.
 * @param {string} matcher - url matcher.
 * @param {function(): Promise} requestCallback - callback that makes request to server.
 * @param {object} expectedOptions - test that should be passed on server with request.
 * @return {Promise} resolved promise.
 */
async function testGeneralServerError(assert, matcher, requestCallback, expectedOptions) {
  try {
    await requestCallback();
  } catch (error) {
    assert.ok(error instanceof GeneralServerError, 'Should throw General Server Error.');
  }

  assertCalledUrl(assert, matcher, expectedOptions);
}

/**
 * Tests making expected number of request to passed url.
 *
 * @param {Qunit.assert} assert - assertions object.
 * @param {string} url - request path.
 * @param {object} expectedOptions - request configuration.
 * @param {number} numberOfCalls - number of calls that was done to passed url.
 */
function assertCalledUrl(assert, url, expectedOptions, numberOfCalls = 1) {
  assert.strictEqual(fetchMock.calls(url, expectedOptions).length, numberOfCalls,
    `Should make request to '${url}' ${numberOfCalls} ${numberOfCalls === 1 ? 'time' : 'times'} in the test.`,
  );
}

/**
 * Asserts that expected number of calls were done to registered urls.
 *
 * @param {Qunit.assert} assert - assertions object.
 */
function assertDone(assert) {
  assert.ok(fetchMock.done(), 'Should make only expected number of requests to registered urls.');
}

/**
 * Mock for TokenService.
 */
class TokenServiceMock {

  /**
   * Instantiates TokenServiceMock.
   *
   * @param {Qunit.assert} assert - assertions object.
   */
  constructor(assert = null) {
    this.assert = assert;
  }

  getToken() {
    const {assert} = this;

    if (assert) {
      assert.step('Should call TokenService.getToken().');
    }

    return 'mock-access-token';
  }

  setToken(token) {
    const {assert} = this;

    if (assert) {
      assert.step(`Should call TokenService.setToken(${token}).`);
    }
  }

  deleteToken() {
    const {assert} = this;

    if (assert) {
      assert.step('Should delete token.');
    }
  }
}
