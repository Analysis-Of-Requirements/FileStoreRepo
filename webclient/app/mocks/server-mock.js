import fetchMock from '../../node_modules/fetch-mock/esm/client.js';
import FileType from '../components/file-list/file/file-type.js';

/**
 * Simulates server.
 * For development and testing purposes only.
 * @type {{run(): void}}
 */
class ServerMock {

  _adminToken = 'admin-token';
  _idCounter = 0;
  _rootFolderId = '0000-0000-0000-0000';
  _docsFolderId = 'docs-docs-docs-docs';
  _musicFolderId = 'musi-cmus-icmu-sic1';
  _videosFolderId = 'vide-osvi-deos-vide';
  _files = [
    {
      meta: {
        name: 'document1.xls',
        id: 'document1-file',
        type: 'file',
        fileType: 'excel',
        size: 20,
        itemsAmount: null,
        parentId: this._docsFolderId,
      },
      content: new Blob(['1'], {type: 'application/vnd.ms-excel'}),
    },
    {
      meta: {
        name: 'document2.xls',
        id: 'document2-file',
        type: 'file',
        fileType: 'excel',
        size: 15,
        itemsAmount: null,
        parentId: this._docsFolderId,
      },
      content: new Blob(['11'], {type: 'application/vnd.ms-excel'}),
    },
    {
      meta: {
        name: 'document3.xls',
        id: 'document3-file',
        type: 'file',
        fileType: 'excel',
        size: 314,
        itemsAmount: null,
        parentId: this._docsFolderId,
      },
      content: new Blob(['111'], {type: 'application/vnd.ms-excel'}),
    },
    {
      meta: {
        name: 'summer.png',
        id: 'summer-file',
        type: 'file',
        fileType: 'image',
        size: 10,
        itemsAmount: null,
        parentId: this._rootFolderId,
      },
      content: new Blob(['1111'], {type: 'image/png'}),
    },
    {
      meta: {
        name: 'winter.jpg',
        id: 'winter-file',
        type: 'file',
        fileType: 'image',
        size: 10,
        itemsAmount: null,
        parentId: this._rootFolderId,
      },
      content: new Blob(['11111'], {type: 'image/png'}),
    },
    {
      meta: {
        name: 'okean_elzy.mp3',
        id: 'music-file',
        type: 'file',
        fileType: 'music',
        size: 564745,
        itemsAmount: null,
        parentId: this._musicFolderId,
      },
      content: new Blob(['11111'], {type: 'audio/mpeg'}),
    },
    {
      meta: {
        name: 'transformers.mp4',
        id: 'video-file',
        type: 'file',
        fileType: 'video',
        size: 56474345,
        itemsAmount: null,
        parentId: this._videosFolderId,
      },
      content: new Blob(['11111'], {type: 'video/mpeg'}),
    },
  ];
  _folders = [
    {
      name: 'Documents',
      id: this._docsFolderId,
      type: 'folder',
      fileType: null,
      size: null,
      itemsAmount: 3,
      parentId: this._rootFolderId,
    },
    {
      name: 'Root',
      id: this._rootFolderId,
      type: 'folder',
      fileType: null,
      size: null,
      itemsAmount: 3,
      parentId: this._rootFolderId,
    },
    {
      name: 'Music',
      id: this._musicFolderId,
      type: 'folder',
      fileType: null,
      size: null,
      itemsAmount: 1,
      parentId: this._rootFolderId,
    },
    {
      name: 'Videos',
      id: this._videosFolderId,
      type: 'folder',
      fileType: null,
      size: null,
      itemsAmount: 1,
      parentId: this._musicFolderId,
    },
  ];

  /**
   * Turns on fetch mode, substituting real server.
   */
  run() {
    fetchMock.config.overwriteRoutes = true;
    const validLogin = 'admin';
    const validPassword = 'qwerty123A';

    fetchMock.post('/api/login', (url, options) => {
      const data = JSON.parse(options.body);

      if (data.login !== validLogin || data.password !== validPassword) {
        return this._createAuthenticationError('Wrong password or login. Check your input data.');
      }

      this._adminToken = 'admin-token';

      return this._createTokenResponse();
    });

    fetchMock.post('/api/registration', (url, options) => {
      const data = JSON.parse(options.body);

      if (data.login === validLogin) {
        return {
          body: {
            validationErrors: [
              {
                field: 'login',
                message: `Login ${data.login} already exists. Please try a new one.`,
              },
            ],
          },
          status: 422,
        };
      }

      return 200;
    });

    fetchMock.get('express:/api/folder/:folderId/content', (url, options) => {
      const token = this._retrieveBearerToken(options);
      const folderId = url.replace(`/api/folder/`, '').replace('/content', '');

      if (token !== this._adminToken) {
        return this._createAuthenticationError('Please, log in.');
      }

      const folder = this._folders.find((folder) => folder.id === folderId);

      if (!folder) {
        return this._createResourceNotFoundError('Specified folder was not found.');
      }

      return this._createFolderContentResponse(folderId);
    }, {
      delay: 700,
    });

    fetchMock.get(`express:/api/folder/:folderId`, (url, options) => {
      const token = this._retrieveBearerToken(options);
      const folderId = url.replace(`/api/folder/`, '');

      if (token !== this._adminToken) {
        return this._createAuthenticationError('Please, log in.');
      }

      if (folderId === 'root') {
        return this._createFolderResponse(this._rootFolderId);
      }

      const folder = this._folders.find((folder) => folder.id === folderId);

      if (!folder) {
        return this._createResourceNotFoundError('Specified resource was not found.');
      }

      return this._createFolderResponse(folderId);
    }, {
      delay: 1000,
    });

    fetchMock.delete(`express:/api/folder/:folderId`, (url, options) => {
      const token = this._retrieveBearerToken(options);
      const folderId = url.replace('/api/folder/', '');

      if (token !== this._adminToken) {
        return this._createAuthenticationError('Please, log in.');
      }

      const folder = this._folders.find((folder) => folder.id === folderId);

      if (!folder) {
        return this._createResourceNotFoundError('Specified folder was not found.');
      }

      this._deleteRecursive(folderId);

      return 200;
    }, {
      delay: 800,
    });

    fetchMock.delete(`express:/api/file/:id`, (url, options) => {
      const token = this._retrieveBearerToken(options);
      const fileId = url.replace('/api/file/', '');

      if (token !== this._adminToken) {
        return this._createAuthenticationError('Please, log in.');
      }

      const file = this._files.find((file) => file.meta.id === fileId);

      if (!file) {
        return this._createResourceNotFoundError('Specified file was not found.');
      }

      this._files = this._files.filter((item) => item.meta.id !== fileId);

      return 200;
    }, {
      delay: 800,
    });

    fetchMock.put(`express:/api/file/:id`, (url, options) => {
      const token = this._retrieveBearerToken(options);
      const fileId = url.replace('/api/file/', '');
      const targetFile = this._files.find((file) => file.meta.id === fileId);
      const sourceFile = JSON.parse(options.body);

      if (token !== this._adminToken) {
        return this._createAuthenticationError('Please, log in.');
      }

      if (!targetFile) {
        return this._createResourceNotFoundError('Specified file was not found.');
      }

      Object.assign(targetFile.meta, sourceFile);

      return 200;
    }, {
      delay: 700,
    });

    fetchMock.put(`express:/api/folder/:id`, (url, options) => {
      const token = this._retrieveBearerToken(options);
      const folderId = url.replace('/api/folder/', '');
      const targetFolder = this._folders.find((folder) => folder.id === folderId);
      const sourceFolder = JSON.parse(options.body);

      if (token !== this._adminToken) {
        return this._createAuthenticationError('Please, log in.');
      }

      if (!targetFolder) {
        return this._createResourceNotFoundError('Specified page url was not found.');
      }

      Object.assign(targetFolder, sourceFolder);

      return 200;
    }, {
      delay: 700,
    });

    fetchMock.post('/logout', () => {
      this._adminToken = '';

      return 200;
    });

    fetchMock.post('express:/api/folder/:id/folder', (url, options) => {
      const token = this._retrieveBearerToken(options);

      if (token !== this._adminToken) {
        return this._createAuthenticationError('Please, log in.');
      }

      const parentFolderId = url.replace('/folder', '')
        .replace('/folder', '')
        .replace('/api/', '');
      const parentFolder = this._folders.find((folder) => folder.id === parentFolderId);

      if (!parentFolder) {
        return this._createResourceNotFoundError('Specified page url was not found.');
      }

      this._incrementIdCounter();
      const folderId = this._getIdCounter();
      const newFolder = {
        id: `${folderId}`,
        name: `folder-${folderId}`,
        type: 'folder',
        fileType: null,
        size: null,
        itemsAmount: 0,
        parentId: parentFolderId,
      };

      this._folders.push(newFolder);

      return newFolder;
    }, {
      delay: 1000,
    });

    fetchMock.get('express:/api/user', (url, options) => {
      const token = this._retrieveBearerToken(options);

      if (token !== this._adminToken) {
        return this._createAuthenticationError('Please, log in.');
      }

      return {
        id: 'user-1',
        name: 'Yehor',
      };
    }, {
      delay: 1200,
    });

    fetchMock.post('express:/api/folder/:folderId/file', (url, options) => {
      const token = this._retrieveBearerToken(options);

      if (token !== this._adminToken) {
        return this._createAuthenticationError('Please, log in.');
      }

      const parentFolderId = url.replace('/api/folder/', '')
        .replace('/file', '');

      const parentFolder = this._folders.find((folder) => folder.id === parentFolderId);

      if (!parentFolder) {
        return this._createResourceNotFoundError('Specified parent folder was not found.');
      }

      this._incrementIdCounter();
      const formData = options.body;
      const file = formData.get('file');
      const fileMeta = {
        name: file.name,
        id: `${this._getIdCounter()}`,
        type: 'file',
        fileType: this.parseMimeType(file.type),
        size: file.size,
        itemsAmount: null,
        parentId: parentFolderId,
      };

      this._files.push({
        meta: fileMeta,
        content: file,
      });

      return fileMeta;
    }, {
      delay: 1000,
    });

    fetchMock.get('express:/api/file/:fileId', (url, options) => {
      const token = this._retrieveBearerToken(options);

      if (token !== this._adminToken) {
        return this._createAuthenticationError('Please, log in.');
      }

      const fileId = url.replace('/api/file/', '');
      const file = this._files.find((file) => file.meta.id === fileId);

      if (!file) {
        return this._createResourceNotFoundError('Such file was not found.');
      }

      const body = file.content;

      return {
        headers: {
          'Content-Type': body.type,
        },
        status: 200,
        body,
      };
    }, {
      delay: 500,
      sendAsJson: false,
    });
  }

  /**
   * Parses Mime type to get corresponding FileType.
   *
   * @param {string} mimeType - Mime type string. I.e. 'application/json' or else.
   * @return {string | null} - parsed Mime type or null if it was not parsed.
   */
  parseMimeType(mimeType) {
    const {DOC, IMAGE, MUSIC, SPREADSHEET, VIDEO, UNDEFINED} = FileType;
    const map = {
      'application/pdf': DOC,
      'application/msword': DOC,
      'application/vnd.ms-excel': SPREADSHEET,
      'text/csv': SPREADSHEET,
      'text': DOC,
      'audio': MUSIC,
      'video': VIDEO,
      'image': IMAGE,
    };

    const matchedKey = Object.keys(map).find((key) => mimeType.startsWith(key));
    return map[matchedKey] || UNDEFINED;
  }

  /**
   * Deletes all items of folder with folderId and nested ones.
   *
   * @param {string} folderId - folder id of folder to delete.
   * @private
   */
  _deleteRecursive(folderId) {
    this._files = this._files.filter((file) => file.meta.parentId !== folderId);
    this._folders = this._folders.filter((folder) => folder.id !== folderId);
    this._folders.forEach((folder) => {
      if (folder.parentId === folderId) {
        this._deleteRecursive(folder.id);
      }
    });
  }

  /**
   * Creates response with authentication error.
   *
   * @param {string} message - error message.
   * @return {{body: {message: *}, status: number}} - response body with authentication error.
   * @private
   */
  _createAuthenticationError(message) {
    return {
      body: message,
      status: 401,
    };
  }

  /**
   * Creates response with page-not-found error.
   *
   * @param {string} message - error message.
   * @return {{body: {message: *}, status: number}} - response body with page-not-found error.
   * @private
   */
  _createResourceNotFoundError(message) {
    return {
      body: message,
      status: 404,
    };
  }

  /**
   * Creates successful response with folder identity.
   *
   * @param {string} folderId - id for requested folder.
   * @return {{size: null, name: string, itemsAmount: number, id: string, type: string, fileType: null, parentId: string} |
   * {size: null, name: string, itemsAmount: number, id: string, type: string, fileType: null, parentId: string}}
   * @private
   */
  _createFolderResponse(folderId) {
    return this._folders.find((folder) => folder.id === folderId);
  }

  /**
   * Creates response containing folder items.
   *
   * @param {string} folderId - items of requested folder.
   * @return {{listItems: ({size: null, name: string, itemsAmount: number, id: string, type: string, fileType: null,
   * parentId: string}|{size: null, name: string, itemsAmount: number, id: string, type: string, fileType: null,
   * parentId: string})[]}}
   * @private
   */
  _createFolderContentResponse(folderId) {
    const files = this._files
      .filter((file) => file.meta.parentId === folderId)
      .map((file) => file.meta);
    const folders = this._folders.filter((folder) => folder.id !== folderId && folder.parentId === folderId);

    return {
      listItems: [...folders, ...files],
    };
  }

  /**
   * Creates response with token.
   *
   * @return {{body: {token: string}, status: number}} - response containing token.
   * @private
   */
  _createTokenResponse() {
    return {
      token: this._adminToken,
    };
  }

  /**
   * Retrieves token from bearer authentication header.
   *
   * @param {object} options - options object, containing Bearer Authentication header.
   * @return {string} - token.
   * @private
   */
  _retrieveBearerToken(options) {
    return options.headers.Authorization.slice(7);
  }

  /**
   * Increments folder id counter.
   *
   * @private
   */
  _incrementIdCounter() {
    this._idCounter++;
  }

  /**
   * Retrieves folder if counter.
   *
   * @return {number} - folder id counter.
   * @private
   */
  _getIdCounter() {
    return this._idCounter;
  }
}

const serverMock = new ServerMock();
export default serverMock;
